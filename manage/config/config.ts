import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;
const isEnvProduction = process.env.NODE_ENV === 'production';
const assetDir = 'assets';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  routes,
  theme: {
    'primary-color': '#9932CC',
  },
  esbuild: {},
  title: false,
  favicon: '/favicon.ico',
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  webpack5: {},
  chainWebpack(config, { env, webpack, createCSSRule }) {
    // 修改js，js chunk文件输出目录
    config.output
      .filename(assetDir + '/js/[name].[hash:8].js')
      .chunkFilename(assetDir + '/js/[name].[contenthash:8].chunk.js');

    // 修改css输出目录
    config.plugin('extract-css').tap(() => [
      {
        filename: `${assetDir}/css/[name].[contenthash:8].css`,
        chunkFilename: `${assetDir}/css/[name].[contenthash:8].chunk.css`,
        ignoreOrder: true,
      },
    ]);

    // 修改图片输出目录
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
      .use('url-loader')
      .loader(require.resolve('url-loader'))
      .tap((options) => {
        const newOptions = {
          ...options,
          name: assetDir + '/img/[name].[hash:8].[ext]',
          fallback: {
            ...options.fallback,
            options: {
              name: assetDir + '/img/[name].[hash:8].[ext]',
              esModule: false,
            },
          },
          publicPath: '../../',
        };
        return newOptions;
      });

    // 修改svg输出目录
    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options) => ({
        ...options,
        name: assetDir + '/img/[name].[hash:8].[ext]',
        publicPath: '../../',
      }));

    // 修改fonts输出目录
    config.module
      .rule('fonts')
      .test(/\.(eot|woff|woff2|ttf|TTF)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options) => ({
        ...options,
        name: assetDir + '/fonts/[name].[hash:8].[ext]',
        fallback: {
          ...options.fallback,
          options: {
            name: assetDir + '/fonts/[name].[hash:8].[ext]',
            esModule: false,
          },
        },
        publicPath: '../../',
      }));

    /** 处理MP4文件 */
    config.module
      .rule('mp4-with-file')
      .test(/\.mp4$/)
      .use('mp4-with-file-loader')
      .loader('file-loader')
      .tap((options) => ({
        ...options,
        name: assetDir + '/video/[name].[hash:8].[ext]',
        publicPath: '../../',
      }));
  },
});
