var path = require("path");
var webpack = require("webpack");
var merge = require("webpack-merge");
var BundleTracker = require("webpack-bundle-tracker");
var WebpackCleanupPlugin = require("webpack-cleanup-plugin");
var common = require("./webpack-common");
var srvDir = require("./srv-dir");

const development = merge(common, {
  mode: "development",

  output: {
    path: srvDir + "/static/bundles",
    filename: "dev-[name]-[hash].js",
    chunkFilename: "[name].bundle.js",
  },

  plugins: [
    new WebpackCleanupPlugin({
      exclude: ["test.js"],
    }),
    new BundleTracker({
      path: srvDir + "/static/bundles",
      filename: "webpack-stats.json",
    }),
  ],
});

const test = merge(common, {
  target: "web",
  mode: "development",
  entry: ["./test"],
  node: {
    fs: "empty",
  },
  output: {
    path: srvDir + "/static/bundles",
    filename: "test.js",
  },
});

module.exports = [development, test];
