---
Record date and git sha on remote server:
  file.line:
    - name: {{ pillar['srv_dir'] }}/deployed_versions.txt
    - mode: insert
    - create: True
    - location: end
    - content: "{{ pillar['salt_run_date'] }} - {{ pillar['git_sha'] }}"
