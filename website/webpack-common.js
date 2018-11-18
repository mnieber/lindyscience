var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  entry: {
    main: './app/main.jsx',
    app: './app/css/app.jsx',
  },

  output: {
    library: 'App'
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
          presets: [
            '@babel/flow',
            '@babel/preset-react',
          ],
          plugins: [
            ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
            'syntax-dynamic-import'
          ]
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
