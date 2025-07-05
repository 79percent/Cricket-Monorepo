// const HappyPack = require('happypack');
// const happyThreadPool = HappyPack.ThreadPool({
//   size: require('os').cpus().length,
// });

const assetDir = 'assets';
const isEnvProduction = process.env.NODE_ENV === 'production';

const webpackPlugin = (config, { env, webpack, createCSSRule }) => {
  // // 多线程
  // config.plugin('HappyPack').use(HappyPack, [
  //   {
  //     id: 'js',
  //     loaders: ['babel-loader'],
  //     threadPool: happyThreadPool,
  //   },
  // ]);
  // if (isEnvProduction) {
  //   // 拆分chunk
  //   config.merge({
  //     optimization: {
  //       minimize: true,
  //       splitChunks: {
  //         chunks: 'async',
  //         minSize: 30000,
  //         minChunks: 1,
  //         automaticNameDelimiter: '.',
  //         cacheGroups: {
  //           lfpantdesigns: {
  //             name: 'antdesigns',
  //             chunks: 'all',
  //             test: /[\\/]node_modules[\\/](@antv|antd|@ant-design)/,
  //             priority: 10,
  //           },
  //           lfpvendors: {
  //             name: 'vendors',
  //             chunks: 'all',
  //             test: /[\\/]node_modules[\\/](lodash|moment|react|dva|postcss|mapbox-gl)/,
  //             priority: 10,
  //           },
  //           lfpassets: {
  //             name: 'assets',
  //             chunks: 'all',
  //             test: /src\/assets/,
  //             priority: 10,
  //           },
  //           // // 最基础的
  //           // 'async-commons': {
  //           //   // 其余异步加载包
  //           //   name: 'async-commons',
  //           //   chunks: 'async',
  //           //   minChunks: 2,
  //           //   priority: 2,
  //           // },
  //           // lfpcommons: {
  //           //   name: 'commons',
  //           //   // 其余同步加载包
  //           //   chunks: 'all',
  //           //   minChunks: 2,
  //           //   priority: 1,
  //           //   // 这里需要注意下，webpack5会有问题， 需加上这个 enforce: true，
  //           //   // refer: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/257#issuecomment-432594711
  //           //   enforce: true,
  //           // },
  //         },
  //       },
  //     },
  //   });
  // }

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
};

export default webpackPlugin;
