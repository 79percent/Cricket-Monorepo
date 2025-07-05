import React from 'react';
import { Menu } from 'antd';
import { connect, Link, useModel, useDispatch, history } from 'umi';
import IconFont from '@/components/pc/IconFont';

const list = [
  // {
  //   id: 'browsingHistory',
  //   label: '浏览记录-施工中',
  //   path: '/pc/browsingHistory',
  //   icon: <IconFont type="icon-jilu" />,
  // },
  // {
  //   id: 'message',
  //   label: '消息-施工中',
  //   path: '/pc/message',
  //   icon: <IconFont type="icon-xinbaniconshangchuan-" />,
  // },
  {
    id: 'publishManage',
    label: '上传管理',
    path: '/pc/publishManage',
    icon: <IconFont type="icon-ucguanliguanlipingtai-zuzhijiagou" />,
  },
  {
    id: 'setting',
    label: '个人设置',
    path: '/pc/setting',
    icon: <IconFont type="icon-shezhi5" />,
  },
  {
    id: 'updatePassword',
    label: '修改密码',
    path: '/pc/setPassword',
    icon: <IconFont type="icon-mima3" />,
  },
  {
    id: 'feedback',
    label: '意见反馈',
    path: '/pc/feedback',
    icon: <IconFont type="icon-yijianfankui4" />,
  },
  {
    id: 'loginOut',
    label: '退出登录',
    path: null,
    icon: <IconFont type="icon-act_tuichu" style={{ color: 'red' }} />,
  },
];

const Menus = () => {
  const { setInitialState, initialState } = useModel('@@initialState');
  const dispatch = useDispatch();

  // 退出登录
  const loginOut = async () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('all_praise');
    sessionStorage.removeItem('all_attention');
    sessionStorage.removeItem('all_favorites');
    await dispatch({
      type: 'login/loginOut',
    });
    await setInitialState({
      ...initialState,
      currentUser: undefined,
      allPraise: undefined,
      allAttention: undefined,
      allFavorites: undefined,
    } as any);
    history.push('/login');
  };

  return (
    <Menu style={{ minWidth: 160 }}>
      {list.map((item) => (
        <Menu.Item key={item.id} icon={item.icon}>
          {item.path ? (
            <Link to={item.path}>{item.label}</Link>
          ) : (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (item.id === 'loginOut') {
                  loginOut();
                }
              }}
            >
              {item.label}
            </span>
          )}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default Menus;
