---
Install node packages:
  cmd.run:
    - name: yarn install --ignore-engines
    - cwd: {{ pillar['srv_dir'] }}/src/website

Run webpack:
  cmd.run:
    - name: ./node_modules/.bin/webpack --config webpack.config.js
    - cwd: {{ pillar['srv_dir'] }}/src/website
