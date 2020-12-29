console.log("VUE_APP_MODE: ", process.env.VUE_APP_MODE);

/**
 * 压缩静态资源文件
 */
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  // 单域名添加配置
  // publicPath: process.env.VUE_APP_MODE === "production" ? "/manager/" : "/",
  devServer: {
    open: true,
    port: 5404,
    disableHostCheck: process.env.NODE_ENV !== "production",
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      const plugins = [];
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
      config.plugins = [...config.plugins, ...plugins];
    }
  },
};
