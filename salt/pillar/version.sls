{% set sha = salt.cmd.shell('git rev-parse HEAD', cwd='/srv/salt-deploy/src') %}
{% set current_time = salt.cmd.shell('date') %}
git_sha: {{ sha|yaml_encode }}
salt_run_date: {{ current_time|yaml_encode }}
