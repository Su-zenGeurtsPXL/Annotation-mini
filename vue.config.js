const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'prod' ||
    process.env.NODE_ENV === 'dev'
      ? '/annotate'
      : '/',
  configureWebpack: {
    mode: 'development',
    devtool: false,
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 15000,
        maxSize: 250000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
      },
    },
  },
});
