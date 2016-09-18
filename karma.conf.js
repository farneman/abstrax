/* eslint-disable no-process-env */
var browsers = process.env.TRAVIS ? ['Firefox'] : ['Chrome'];

var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function (config) {
  config.set({
    browsers: browsers,
    coverageReporter: {
      dir: 'coverage/',
      includeAllSources: true,
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    },
    customLaunchers: {
      ChromeTravisCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      {pattern: 'spec/*_spec.js', watched: false}
    ],
    preprocessors: {
      'spec/*_spec.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'coverage'],
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    }
  });
};
