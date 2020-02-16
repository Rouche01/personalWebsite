const merge = require('webpack-merge');

module.exports = merge(require('./config.base.js'), {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map'

    // All webpack config for development environment
})