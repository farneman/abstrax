module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        files: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/lodash/lodash.js',
            'index.js',
            'spec/*_spec.js'
        ]
    })
}
