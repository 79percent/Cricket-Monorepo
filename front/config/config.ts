import { defineConfig } from 'umi';
import routes from './routes';
import proxy from './proxy';
import webpackPlugin from './plugin';
import { htmlFontSize, buriedPoint } from './headScripts';

const { REACT_APP_ENV } = process.env;
const isEnvProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  title: 'Cricket 动漫插画分享-个人图片收藏-二次元壁纸美图',
  favicon: '/favicon.ico',
  nodeModulesTransform: {
    type: 'none',
  },
  targets: {
    ie: 11,
  },
  headScripts: [htmlFontSize, buriedPoint],
  metas: [
    {
      name: 'keywords',
      content: 'cricket, 动漫,美图,图片,插画,二次元,壁纸,可爱,萌妹,原创',
    },
    {
      name: 'description',
      content:
        '壁纸,二次元,动漫,美图,图片,下载高清图片,优质图片,分享动漫美图,插画集,点赞收藏图片,头像,手机壁纸',
    },
    {
      name: 'viewport',
      content:
        'width=device-width, user-scalable=no,initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0',
    },
  ],
  polyfill: {
    imports: ['core-js/stable'],
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  hash: true,
  fastRefresh: {},
  history: {
    // type: 'hash',
    type: 'browser',
    // type: isEnvProduction ? 'hash' : 'browser',
  },
  antd: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
    baseSeparator: '-',
  },
  dva: {
    hmr: true,
  },
  theme: {
    'primary-color': '#8462bb',
  },
  terserOptions: {
    compress: {
      drop_console: isEnvProduction,
    },
  },
  define: {},
  routes,
  ignoreMomentLocale: true,
  // dynamicImport: {
  //   loading: '@/components/PageLoading',
  // },
  chunks: isEnvProduction ? ['umi'] : undefined,
  chainWebpack: webpackPlugin,
  webpack5: isEnvProduction ? {} : undefined,
  // mfsu: {},
});
