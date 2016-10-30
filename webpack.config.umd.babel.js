/* eslint-disable no-process-env */
import webpack from 'webpack';

const { NODE_ENV } = process.env;
const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
];
const filename = `abstrax${NODE_ENV === 'production' ? '.min' : ''}.js`;

if (NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {

        /* eslint-disable camelcase */
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false

        /* eslint-enable camelcase */
      }
    })
  );
}

export default {
  context: __dirname,
  entry: './src/index.js',
  output: {
    filename,
    path: './dist',
    library: 'abstrax',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: [
            'add-module-exports'
          ]
        }
      }
    ]
  },
  plugins
};
