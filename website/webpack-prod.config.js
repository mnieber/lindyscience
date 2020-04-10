var path = require("path");
var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var merge = require("webpack-merge");
var BundleTracker = require("webpack-bundle-tracker");
var WebpackCleanupPlugin = require("webpack-cleanup-plugin");
var common = require("./webpack-common");
var srv_dir = require("./srv-dir");

const production = merge(common, {
  mode: "production",

  output: {
    path: srv_dir + "/static/bundles",
    filename: "prod-[name]-[hash].js",
    chunkFilename: "[name].bundle.js",
  },

  stats: {
    warnings: false,
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new WebpackCleanupPlugin({}),
    new BundleTracker({
      path: srv_dir + "/static/bundles",
      filename: "webpack-stats.json",
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "../css/[name].css",
      chunkFilename: "../css/[id].css",
    }),
  ],
});

module.exports = production;
