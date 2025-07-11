export default [
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/login',
    layout: false,
    hideInMenu: true,
    name: '登录',
    component: '@/pages/Login',
  },
  {
    path: '/welcome',
    hideInMenu: true,
    name: '欢迎使用',
    component: '@/pages/Welcome',
    access: 'canAdmin',
  },
  {
    name: '用户管理',
    icon: 'user',
    path: '/user',
    access: 'canAdmin',
    routes: [
      {
        path: '/user',
        redirect: '/user/list',
      },
      {
        name: '用户列表',
        path: '/user/list',
        component: '@/pages/User/List',
      },
      {
        name: '创建用户',
        path: '/user/add',
        component: '@/pages/User/Add',
      },
      {
        component: '404',
      },
    ],
  },
  {
    name: '投稿管理',
    icon: 'icon-ucguanliguanlipingtai-zuzhijiagou',
    path: '/work',
    access: 'canAdmin',
    routes: [
      {
        path: '/work',
        redirect: '/work/list',
      },
      {
        name: '投稿列表',
        path: '/work/list',
        component: '@/pages/Work/List',
      },
      {
        name: '发布作品',
        path: '/work/add',
        component: '@/pages/Work/Add',
      },
      {
        component: '404',
      },
    ],
  },
  {
    name: '审核管理',
    icon: 'monitor',
    path: '/audit',
    access: 'canAdmin',
    routes: [
      {
        path: '/audit',
        redirect: '/audit/wait',
      },
      {
        name: '待审核',
        path: '/audit/wait',
        component: '@/pages/Audit/WaitAudit',
      },
      {
        name: '已通过',
        path: '/audit/pass',
        component: '@/pages/Audit/PassAudit',
      },
      {
        name: '未通过',
        path: '/audit/unpass',
        component: '@/pages/Audit/UnPassAudit',
      },
      {
        component: '404',
      },
    ],
  },
  {
    name: '用户访问量',
    icon: 'monitor',
    path: '/userVisits',
    access: 'canAdmin',
    component: '@/pages/UserVisits',
  },
  {
    component: '404',
  },
];
