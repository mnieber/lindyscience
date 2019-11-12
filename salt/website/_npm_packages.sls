---
Install node packages:
  cmd.run:
    - name: yarn install --ignore-engines
    - cwd: {{ pillar['srv_dir'] }}/src/website
