module.exports = {
  devServer: {
    proxy: {
      '/v1/*': {
        target: 'http://localhost:8001',
        secure:false,
        changeOrigin: true,
        pathRewrite: {
          '^/v1': ''
        }
      },
    }
  }
}