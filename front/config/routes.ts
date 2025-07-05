export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        path: '/',
        title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
      },
      /**
       * 以下为PC端的路由
       * 登录页面与其他页面分开的理由是：
       * 其他页面需要一个顶部的搜索框，而登录页面没有
       */
      {
        title: '登录',
        access: 'canPC',
        path: '/pc/login',
        component: '@/pages/pc/Login',
      },
      {
        path: '/pc',
        access: 'canPC',
        component: '@/layouts/pc/main',
        routes: [
          {
            path: '/pc',
            redirect: '/pc/home',
          },
          {
            title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
            path: '/pc/home',
            component: '@/pages/pc/Home',
          },
          {
            title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
            path: '/pc/detail',
            component: '@/pages/pc/Detail',
          },
          {
            title: '上传',
            path: '/pc/publish',
            component: '@/pages/pc/Publish',
            wrappers: ['@/wrappers/auth'],
          },
          {
            title: '上传管理',
            path: '/pc/publishManage',
            component: '@/pages/pc/PublishManage',
            wrappers: ['@/wrappers/auth'],
          },
          {
            title: '个人设置',
            path: '/pc/setting',
            component: '@/pages/pc/Setting',
            wrappers: ['@/wrappers/auth'],
          },
          {
            title: '设置密码',
            path: '/pc/setPassword',
            component: '@/pages/pc/SetPassword',
            wrappers: ['@/wrappers/auth'],
          },
          {
            title: '意见反馈',
            path: '/pc/feedback',
            component: '@/pages/pc/Feedback',
          },
          {
            title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
            path: '/pc/space',
            component: '@/pages/pc/Space',
          },
          {
            title: '404',
            component: './404',
          },
        ],
      },
      /**
       * 以下为移动端的路由
       */
      {
        title: '登录',
        path: '/mb/login',
        component: '@/pages/mb/Login',
      },
      {
        path: '/mb',
        access: 'canMobile',
        component: '@/layouts/mb/main',
        routes: [
          {
            path: '/mb',
            redirect: '/mb/home',
          },
          {
            title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
            path: '/mb/home',
            component: '@/pages/mb/Home',
          },
          {
            title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
            path: '/mb/detail',
            component: '@/pages/mb/Detail',
          },
          {
            title: '上传',
            path: '/mb/publish',
            component: '@/pages/mb/Publish',
            wrappers: ['@/wrappers/auth'],
            isDevelop: true,
          },
          {
            title: '个人设置',
            path: '/mb/setting',
            component: '@/pages/mb/Setting',
            wrappers: ['@/wrappers/auth'],
            isDevelop: true,
          },
          {
            title: '设置密码',
            path: '/mb/setPassword',
            component: '@/pages/mb/SetPassword',
            wrappers: ['@/wrappers/auth'],
            isDevelop: true,
          },
          {
            title: '意见反馈',
            path: '/mb/feedback',
            isDevelop: true,
            component: '@/pages/mb/Feedback',
          },
          {
            title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
            path: '/mb/space',
            isDevelop: true,
            component: '@/pages/mb/Space',
          },
          {
            title: 'Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
            path: '/mb/menu',
            component: '@/pages/mb/Menu',
          },
          {
            title: '404',
            component: './404',
          },
        ],
      },
      {
        title: '404 - Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
        component: './404',
      },
    ],
  },
  {
    title: '404 - Cricket 动漫插画-个人图片收藏分享-二次元壁纸美图',
    component: './404',
  },
];
