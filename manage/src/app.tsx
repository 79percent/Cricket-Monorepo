import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { message, notification } from 'antd';
import logo from '@/assets/icon/logo.svg';
import { getInfoAPI } from '@/api/user';
import { createLogger } from 'redux-logger';
import { getFilenameFromHeaders } from '@/utils';
import type { RequestOptionsInit } from 'umi-request';

const loginPath = '/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.UserInfo;
  fetchUserInfo?: () => Promise<API.UserInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        const res = await getInfoAPI({
          id: userId,
        });
        const { code, data } = res || {};
        if (code === 0) {
          return data;
        }
      }
      throw new Error('未登录');
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  let currentUser;
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    currentUser = await fetchUserInfo();
  }
  return {
    currentUser,
    fetchUserInfo,
    settings: {},
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: (
      <img
        alt="logo"
        src={logo}
        style={{
          width: 165,
          height: 72,
        }}
      />
    ),
    iconfontUrl: '//at.alicdn.com/t/font_2781054_lejfyipebfp.js',
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  // timeout: 10000,
  // 异常处理
  errorHandler: async (error) => {
    if (error.type === 'SyntaxError') {
      notification.error({
        description: '请联系研发人员处理。',
        message: '未知错误',
      });
    } else if (error.type === 'Timeout') {
      notification.error({
        description: '请检查网络环境或者稍后重试。',
        message: '请求超时',
      });
    } else {
      const { response } = error;
      if (response && response.status) {
        const codeMessage = {
          200: '服务器成功返回请求的数据。',
          201: '新建或修改数据成功。',
          202: '一个请求已经进入后台排队（异步任务）。',
          204: '删除数据成功。',
          400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
          401: '您还没有登录账号',
          403: '用户得到授权，但是访问是被禁止的。',
          404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
          406: '请求的格式不可得。',
          410: '请求的资源被永久删除，且不会再得到的。',
          422: '当创建一个对象时，发生一个验证错误。',
          500: '发生未知错误，请联系研发人员处理。',
          502: '网关错误。',
          503: '服务不可用，服务器暂时过载或维护。',
          504: '网关超时。',
        };
        const errorText = codeMessage[response.status] || response.statusText;
        // const { status, url } = response;
        notification.error({
          message: ``,
          description: errorText,
        });
        const res = await response.json();
        if (res?.code === -1) {
          // token失效,退出登录
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('token');
          history.push('/login');
          window.scrollTo(0, 0);
        }
      } else if (!response) {
        notification.error({
          description: '您的网络发生异常，无法连接服务器',
          message: '网络异常',
        });
      }
    }
    return error?.response;
  },
  // 请求拦截
  requestInterceptors: [
    (url, options) => {
      const headers: RequestOptionsInit = {};
      const token = sessionStorage.getItem('token');
      if (token) {
        headers.token = token;
      }
      return {
        url,
        options: {
          ...options,
          headers,
        },
      };
    },
  ],
  // 响应拦截
  responseInterceptors: [
    async (response, options) => {
      if (response.ok) {
        const token = response.headers.get('token');
        if (token) {
          sessionStorage.setItem('token', token);
        }
        const { type } = options;
        // 如果请求options传入 type: file，则自动下载文件
        if (type?.toLocaleLowerCase() === 'file') {
          const filename = getFilenameFromHeaders(response);
          const blob = await response.blob();
          const a = document.createElement('a');
          a.download = filename;
          a.style.display = 'none';
          a.href = URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return blob;
        }
        const res = await response.json();
        if (res?.code === -1) {
          // token失效,退出登录
          message.error(res?.message);
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('token');
          history.push('/login');
          window.scrollTo(0, 0);
        }
        return res;
      }
      return response;
    },
  ],
};

export const dva = {
  config: {
    onAction: createLogger(),
  },
};
