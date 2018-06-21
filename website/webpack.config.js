var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var BundleTracker = require('webpack-bundle-tracker')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var common = require('./webpack-common');
var srvDir = require('./srv-dir');


const development = merge(common, {
  mode: 'development',

  output: {
      path: srvDir + '/static/bundles',
      filename: "dev-[name]-[hash].js",
      chunkFilename: '[name].bundle.js',
  },

  plugins: [
    new WebpackCleanupPlugin({}),
    new BundleTracker({path: srvDir + '/static/bundles', filename: 'webpack-stats.json'})
  ],
});

module.exports = development;
