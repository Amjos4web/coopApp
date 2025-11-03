// vue.config.js
module.exports = {
  publicPath: '/', // ✅ important for Laravel hosting
  outputDir: 'dist',
  filenameHashing: false,
  devServer: {
    proxy: {
      '/v1/*': {
        target: 'https://dashboard.ogbomosooluwalosecicu.com.ng',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/v1': ''
        }
      },
    },
  },
};
