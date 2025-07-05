export default {
  dev: {
    '/api/': {
      target: 'http://localhost:6666',
      changeOrigin: true,
    },
    '/static/': {
      target: 'http://localhost:6666',
      changeOrigin: true,
    },
    '/ws': {
      target: 'ws://localhost:6666',
      changeOrigin: true,
      ws: true,
    },
  },
  // dev: {
  //   '/api/': {
  //     target: 'http://cricket.cab',
  //     changeOrigin: true,
  //   },
  //   '/static/': {
  //     target: 'http://cricket.cab',
  //     changeOrigin: true,
  //   },
  //   '/ws': {
  //     target: 'ws://cricket.cab',
  //     changeOrigin: true,
  //     ws: true,
  //   },
  // },
};
