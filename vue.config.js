module.exports = {
  devServer: {
    proxy: {
      "/webapi": {
        target: "https://10.110.60.129/",
        changeOrigin: true,
        pathRewrite: {
          "^/webapi": ""
        }
      },
      "/api": {
        target: "http://10.110.60.135:8082/",
        // target: "http://127.0.0.1:5000/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      },
    }
  },
};