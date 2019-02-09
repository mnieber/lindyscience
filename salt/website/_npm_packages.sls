---
Install node packages:
  cmd.run:
    - name: yarn install --ignore-engines
    - cwd: /srv/linsci/src/website

Run webpack:
  cmd.run:
    - name: ./node_modules/.bin/webpack --config webpack-prod.config.js
    - cwd: /srv/linsci/src/website
