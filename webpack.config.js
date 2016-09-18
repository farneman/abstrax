var FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');

var plugins = [
  new FlowStatusWebpackPlugin({
    failOnError: true,
    quietSuccess: true
  })
];

module.exports = {
  context: __dirname,
  devTool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    filename: 'abstrax.js',
    path: './lib'
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },
  plugins: plugins
};
