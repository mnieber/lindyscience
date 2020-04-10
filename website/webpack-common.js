var path = require("path");
var webpack = require("webpack");

const config = {
  entry: {
    main: "./app/main.jsx",
  },

  resolve: {
    modules: ["./node_modules", "."],
    alias: {},
    extensions: ["*", ".js", ".jsx"],
  },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/flow", "@babel/preset-react"],
          plugins: [
            "babel-plugin-rewire",
            [
              "@babel/plugin-proposal-pipeline-operator",
              { proposal: "minimal" },
            ],
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/syntax-dynamic-import",
          ],
        },
      },
    ],
  },
  plugins: [],
};

module.exports = config;
