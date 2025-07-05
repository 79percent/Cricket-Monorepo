import 'moment/locale/zh-cn';

/**
 * 将数字格式化为简写
 * 1200 > 1.2k ; 12345 > 1.2w
 * @param num
 * @returns {String}
 */
export const formatNumber = (num: number): string => {
  if (0 <= num && num < 1000) {
    return `${num}`;
  } else if (1000 <= num && num < 10000) {
    const k = Math.floor(num / 1000);
    const n = num - k * 1000;
    const b = Math.floor(n / 100);
    return `${k}.${b}K`;
  } else {
    const w = Math.floor(num / 10000);
    const n = num - w * 10000;
    const k = Math.floor(n / 1000);
    return `${w}.${k}W`;
  }
};

/**
 * 计算图片在盒子中的最大尺寸
 * @param imgW
 * @param imgH
 * @param maxW
 * @param maxH
 * @returns
 */
export const calculateImgSize = (
  imgW: number = 0,
  imgH: number = 0,
  maxW: number = 0,
  maxH: number = 0,
) => {
  if (imgW === 0 || imgH === 0 || maxW === 0 || maxH === 0) {
    return {
      width: 0,
      height: 0,
    };
  }
  const imgHeight = Number(imgH);
  const imgWidth = Number(imgW);
  const coefficient = imgWidth / imgHeight;
  let width = 0;
  let height = 0;
  if (imgHeight >= imgWidth) {
    height = maxH;
    width = (height * imgWidth) / imgHeight;
  } else {
    width = maxW;
    height = (width * imgHeight) / imgWidth;
  }
  if (width > maxW) {
    const diff = width - maxW;
    width = maxW;
    height -= diff / coefficient;
  }
  if (height > maxH) {
    const diff = height - maxH;
    height = maxH;
    width -= diff * coefficient;
  }
  return {
    width,
    height,
  };
};

/**
 * 计算在盒子中的合适尺寸
 */
export const calculateImgSize2 = (
  imgW: number = 0,
  imgH: number = 0,
  maxW: number = 0,
  maxH: number = 0,
  minW: number = 0,
  minH: number = 0,
) => {
  if (imgW === 0 || imgH === 0 || maxW === 0 || maxH === 0) {
    return {
      width: 0,
      height: 0,
    };
  }
  const coefficient = imgW / imgH;
  let width = 0,
    height = 0;
  if (imgW > imgH) {
    // 宽大于高的情况
    height = maxH;
    width = coefficient * height;
    width = width > maxW ? maxW : width;
    width = width < minW ? minW : width;
    height = width / coefficient;
  } else {
    width = maxW;
    height = width / coefficient;
    height = height > maxH ? maxH : height;
    height = height < minH ? minH : height;
    width = coefficient * height;
  }
  return {
    width,
    height,
  };
};

/**
 * 从返回头里获取文件名
 * @param {response} 请求头
 * @returns {filename} 文件名
 */
export const getFilenameFromHeaders = (response) => {
  // const cd = "attachment; filename=\"%E6%96%87%E4%BB%B6.html\"; filename*=UTF-8''%E6%96%87%E4%BB%B6.css";
  const cd = response.headers.get('content-disposition');
  const reg1 = /filename=((['"]).*?\2|[^;\n]*)/g;
  const reg2 = /filename\*=((['"]).*?\2|[^;\n]*)/g;
  const [filenameURL1] = cd.match(reg1) || [];
  const [filenameURL2] = cd.match(reg2) || [];
  if (filenameURL1) {
    const [, filename] = filenameURL1.split('=');
    return decodeURI(filename.replaceAll(/^"|"$/g, ''));
  }
  if (filenameURL2) {
    const [, filename] = filenameURL2.split("''");
    return decodeURI(filename.replaceAll(/^"|"$/g, ''));
  }
  return '未命名';
};

/**
 * 判断是否为移动端
 */
export const isMobile = !!navigator.userAgent.match(
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
);

/**
 * 查看本地登录状态
 */
export const getLoginStatus = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return {
    isLogin: token && userId,
    userId,
    token,
  };
};

/**
 * 延迟函数
 * @param time
 * @returns
 */
export const delay = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });

/**
 * 求出DOM元素距离页面顶部的距离
 * @param el
 * @returns
 */
export const getElementToPageTop = (el: HTMLElement) => {
  if (el.parentElement) {
    return getElementToPageTop(el.parentElement) + el.offsetTop;
  }
  return el.offsetTop;
};

/**
 * 弹性动画滚动到页面指定距离
 */
export const bounceAnime = (top: number) => {
  let i = 0;
  const currentY = window.scrollY;
  const diff = currentY - top;
  // if (diff <= 0) {
  //   return;
  // }
  function easeInOutBack(x: number): number {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }
  function anime() {
    window.requestAnimationFrame(() => {
      if (i > 1) {
        i = 1;
      }
      const top = easeInOutBack(i) * diff;
      window.scrollTo(0, currentY - top);
      if (i >= 1) {
        return;
      } else {
        i += 0.02;
        anime();
      }
    });
  }
  anime();
};

/**
 * 匹配路由
 * @param path
 * @param routes
 */
type RouteType = {
  path: string;
  isDevelop?: boolean;
};
export const matchRoute = (
  path: string,
  routes: { path: string; isDevelop?: boolean; routes?: RouteType[] }[],
) => {
  let findRoute;
  routes.forEach((item) => {
    if (Array.isArray(item.routes)) {
      findRoute = matchRoute(path, item.routes);
      return;
    }
    if (item.path === path) {
      findRoute = item;
    }
  });
  return findRoute;
};
