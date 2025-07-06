/**
 * 验证设备和路由，防止用户手动修改路由地址
 */
import { Redirect, history, Link } from 'umi';
import { isMobile, matchRoute } from '@/utils';
import React from 'react';
import TipsInfo from '@/components/mb/TipsInfo';

export default (props) => {
  const { location } = history;
  const { route, children } = props;
  const { routes } = route;
  const { pathname, search } = location;
  const currentRoute = matchRoute(pathname, routes);
  if (currentRoute) {
    const { isDevelop } = currentRoute;
    if (isDevelop) {
      return (
        <TipsInfo
          title="页面正在开发中..."
          content={''}
        />
      );
    }
  }

  switch (pathname) {
    case '/':
      if (isMobile) {
        return <Redirect to="/mb" />;
      } else {
        return <Redirect to="/pc" />;
      }
      break;

    case '/login':
      return <Redirect to={`${isMobile ? '/mb' : '/pc'}/login`} />;

    default:
      const pathSplit = pathname.split('/');
      if (pathSplit.includes('pc') && pathSplit[1] === 'pc' && isMobile) {
        const transformUrl = pathname.replace('pc', 'mb') + search;
        return <Redirect to={transformUrl} />;
      }
      if (pathSplit.includes('mb') && pathSplit[1] === 'mb' && !isMobile) {
        const transformUrl = pathname.replace('mb', 'pc') + search;
        return <Redirect to={transformUrl} />;
      }
  }
  return <>{children}</>;
};
