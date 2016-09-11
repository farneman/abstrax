var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    coverageReporter: {
      type : 'html',
      dir : 'coverage/',
      includeAllSources: true
    },
    frameworks: ['jasmine'],
    files: [
      {pattern: 'spec/*_spec.js', watched: false}
    ],
    preprocessors: {
      'spec/*_spec.js': ['webpack']
    },
    reporters: ['progress', 'coverage'],
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    }
  });
};
