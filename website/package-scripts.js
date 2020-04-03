module.exports = {
  scripts: {
    webpack: {
      default: "./node_modules/.bin/webpack",
      watch: "./node_modules/.bin/webpack --watch-stdin",
    },
    flow: {
      watch: "./node_modules/.bin/flow-watch",
      "install-types": "node_modules/.bin/flow-typed install",
    },
    test: "./node_modules/.bin/tape /srv/linsci/static/bundles/test.js",
  },
};
