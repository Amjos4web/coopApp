module.exports = {
  devServer: {
    proxy: {
      '/v1/*': {
        target: 'http://127.0.0.1:8000',
        secure:false,
        changeOrigin: true,
        pathRewrite: {
          '^/v1': ''
        }
      },
    }
},
}