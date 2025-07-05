import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig } from 'umi';
import { history } from 'umi';
import { message, notification } from 'antd';
import { getFilenameFromHeaders, isMobile } from '@/utils';
import { getInfoAPI } from '@/api/user';
import { getAllPraiseAPI } from '@/api/praiseStatus';
import { getAllAttentionAPI } from '@/api/attentionStatus';
import { getAllFavoritesAPI } from '@/api/favoritesItems';
import { getLoginStatus } from '@/utils';
import React from 'react';
import '@nutui/nutui-react/dist/style.css';
import 'tdesign-mobile-react/es/style/index.css';
// import './buriedPoint';

const loginPath = '/login';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * 初始状态
 * */
export async function getInitialState(): Promise<{
  currentUser: any;
  allPraise: any;
  allAttention: any;
  allFavorites: any;
  fetchUserInfo: () => Promise<any | {}>;
  fetchAllPraise: () => Promise<any | []>;
  fetchAllAttention: () => Promise<any | []>;
  fetchAllFavorites: () => Promise<any | []>;
  isMobile: boolean;
}> {
  const fetchUserInfo = async () => {
    try {
      const id = localStorage.getItem('userId');
      const res = await getInfoAPI({ id });
      if (res?.code === 0) {
        sessionStorage.setItem('user_info', JSON.stringify(res?.data));
        return res?.data;
      }
      message.error(res?.message);
      return {};
    } catch (error) {
      return {};
    }
  };
  const fetchAllPraise = async () => {
    try {
      const id = localStorage.getItem('userId');
      const res = await getAllPraiseAPI({ userId: id });
      if (res?.code === 0) {
        sessionStorage.setItem('all_praise', JSON.stringify(res?.data));
        return res?.data;
      }
      message.error(res?.message);
      return [];
    } catch (error) {
      return [];
    }
  };
  const fetchAllAttention = async () => {
    try {
      const id = localStorage.getItem('userId');
      const res = await getAllAttentionAPI({ userId: id });
      if (res?.code === 0) {
        sessionStorage.setItem('all_attention', JSON.stringify(res?.data));
        return res?.data;
      }
      message.error(res?.message);
      return [];
    } catch (error) {
      return [];
    }
  };
  const fetchAllFavorites = async () => {
    try {
      const id = localStorage.getItem('userId');
      const res = await getAllFavoritesAPI({ userId: id });
      if (res?.code === 0) {
        sessionStorage.setItem('all_favorites', JSON.stringify(res?.data));
        return res?.data;
      }
      message.error(res?.message);
      return [];
    } catch (error) {
      return [];
    }
  };
  let currentUser, allPraise, allAttention, allFavorites;
  // 如果是登录页面，不执行
  const { isLogin } = getLoginStatus();
  if (history.location.pathname !== loginPath && isLogin) {
    const sessionUserInfo = sessionStorage.getItem('user_info');
    if (sessionUserInfo) {
      currentUser = JSON.parse(sessionUserInfo);
    } else {
      currentUser = await fetchUserInfo();
    }
    const sessionAllPraise = sessionStorage.getItem('all_praise');
    if (sessionAllPraise) {
      allPraise = JSON.parse(sessionAllPraise);
    } else {
      allPraise = await fetchAllPraise();
    }
    const sessionAllAttention = sessionStorage.getItem('all_attention');
    if (sessionAllAttention) {
      allAttention = JSON.parse(sessionAllAttention);
    } else {
      allAttention = await fetchAllAttention();
    }
    const sessionAllFavorites = sessionStorage.getItem('all_favorites');
    if (sessionAllFavorites) {
      allFavorites = JSON.parse(sessionAllFavorites);
    } else {
      allFavorites = await fetchAllFavorites();
    }
  }
  return {
    fetchUserInfo,
    fetchAllPraise,
    fetchAllAttention,
    fetchAllFavorites,
    currentUser,
    allPraise,
    allAttention,
    allFavorites,
    isMobile,
  };
}

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
        const { status, url } = response;
        notification.error({
          message: ``,
          description: errorText,
        });
        const res = await response.json();
        if (res?.code === -1) {
          // token失效,退出登录
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          history.push(isMobile ? '/mb/login' : '/pc/login');
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
      const headers = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['token'] = token;
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
          localStorage.setItem('token', token);
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
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          sessionStorage.removeItem('user_info');
          sessionStorage.removeItem('all_praise');
          sessionStorage.removeItem('all_attention');
          sessionStorage.removeItem('all_favorites');
          history.push(isMobile ? '/mb/login' : '/pc/login');
          window.scrollTo(0, 0);
        }
        return res;
      }
      return response;
    },
  ],
};
