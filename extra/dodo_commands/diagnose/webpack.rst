Javascript bundling with webpack
================================

The pages served by the PAN server require the creation of a javascript bundle with webpack. Webpack will run in the directory {{ '/WEBPACK/webpack_dir' | dodo_expand(verbose=True) }}. To run webpack, use `dodo webpack`. To re-run it automatically use `dodo webpack --inspect`.

Webpack also compiles the scss files listed in `bundle.jsx` and stores the css output in `/srv/linsci/static/css`.
