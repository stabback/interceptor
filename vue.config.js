// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  publicPath: '/ui',
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@client': path.resolve(__dirname, 'client', 'src'),
        '@server': path.resolve(__dirname, 'server'),
        '@definitions': path.resolve(__dirname, 'definitions', 'index.d.ts'),
      },
    },
  },
  devServer: {
    progress: false,
  },
};
