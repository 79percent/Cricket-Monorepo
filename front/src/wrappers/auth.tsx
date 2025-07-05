/**
 * 验证是否登录
 * 如果未登录，跳转至登录界面
 */
import { Redirect, useModel } from 'umi';
import { isMobile } from '@/utils';
import React from 'react';

export default (props) => {
  const { initialState } = useModel('@@initialState');
  const isLogin = !!initialState?.currentUser;
  if (!isLogin) {
    const url = isMobile ? '/mb/login' : '/pc/login';
    return <Redirect to={url} />;
  } else {
    return <>{props.children}</>;
  }
};
