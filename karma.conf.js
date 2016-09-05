var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
            {pattern: 'spec/*_spec.js', watched: false}
    ],
    preprocessors: {
      'spec/*_spec.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    }
  });
};
