---
Remove destination for copying source files:
  file.absent:
    - name: {{ pillar['srv_dir'] }}/static/bundles

Create destination for copying source files:
  file.directory:
    - name: {{ pillar['srv_dir'] }}/static/bundles

Copy website source files:
  file.recurse:
    - name: {{ pillar['srv_dir'] }}/static/bundles
    - source: salt://website/bundles
    - user: root
    - group: root
    - file-mode: 0600
    - exclude_pat: '*.pyc'

Copy django source files:
  file.recurse:
    - name: {{ pillar['srv_dir'] }}/src/django
    - source: salt://website/source_files/django
    - user: root
    - group: root
    - file-mode: 0600
    - exclude_pat: '*.pyc'

Record git sha on remote server:
  file.managed:
    - name: {{ pillar['srv_dir'] }}/deployed_version.txt
    - contents:
      - {{ pillar['git_sha'] }}
