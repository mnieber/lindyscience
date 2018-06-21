var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  entry: {
    main: './jsx/main.jsx',
    landing_page: './jsx/landing_page.jsx',
  },

  resolve: {
    modules: [
      './node_modules',
      '.',
    ],
    alias: {},
    extensions: ['*', '.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['babel-preset-es2015', 'babel-preset-react', 'es2015'],
          plugins: ['transform-object-rest-spread', 'transform-class-properties', 'syntax-dynamic-import']
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "../css/[name].css",
      chunkFilename: "../css/[id].css"
    })
  ],
};

module.exports = config;
