var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var BundleTracker = require('webpack-bundle-tracker')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var common = require('./webpack-common');
var srv_dir = require('./srv-dir');


const production = merge(common, {
  mode: 'production',

  output: {
      path: srv_dir + '/static/bundles',
      filename: "prod-[name]-[hash].js",
  },

  stats: {
    warnings: false
  },

  plugins: [
    new WebpackCleanupPlugin({}),
    new BundleTracker({path: srv_dir + '/static/bundles', filename: 'webpack-stats.json'})
  ]
});

module.exports = production;
