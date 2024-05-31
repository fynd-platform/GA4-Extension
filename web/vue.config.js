const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('vue', '@vue/compat');

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        const modifiedOptions = {
          ...options,
          compilerOptions: { compatConfig: { MODE: 2 } },
        };
        return modifiedOptions;
      });
    config.module
      .rule('js') // Target the existing 'js' rule
      .include.add(path.resolve(__dirname, 'node_modules/vue-meta')); // Include vue-meta
  },
  outputDir: '../public',
  indexPath: '../public/index.html',
  devServer: {
    port: 5081,
    public: 'localdev.fyndx0.de:5081',
    disableHostCheck: true,
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/main.less')],
    },
  },
  configureWebpack: {
    plugins: [],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules/vue-meta'),
            path.resolve(__dirname, 'node_modules/@gofynd/nitrozen-vue'),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  },
};
