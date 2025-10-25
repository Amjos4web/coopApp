// vue.config.js
module.exports = {
  publicPath: '/', // ✅ important for Laravel hosting
  outputDir: 'dist',
  filenameHashing: false,
  devServer: {
    proxy: {
      '/v1/*': {
        target: 'http://127.0.0.1:8000',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/v1': ''
        }
      },
    },
  },
};
