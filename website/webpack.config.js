var path = require("path");
var webpack = require("webpack");
var merge = require("webpack-merge");
var BundleTracker = require("webpack-bundle-tracker");
var WebpackCleanupPlugin = require("webpack-cleanup-plugin");
var common = require("./webpack-common");
var srvDir = require("./srv-dir");

const css_rules = [
  {
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
  },
  {
    test: /\.css$/i,
    use: ["style-loader", "css-loader"],
  },
];

const development = merge(common, {
  mode: "development",

  output: {
    path: srvDir + "/static/bundles",
    filename: "dev-[name]-[hash].js",
    chunkFilename: "[name].bundle.js",
  },

  module: {
    rules: css_rules,
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
  module: {
    rules: css_rules,
  },
});

module.exports = [development, test];
