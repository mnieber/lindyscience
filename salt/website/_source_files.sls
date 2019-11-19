---
Remove bundles destination:
  file.absent:
    - name: {{ pillar['srv_dir'] }}/static/bundles

Create bundles destination:
  file.directory:
    - name: {{ pillar['srv_dir'] }}/static/bundles

Copy bundles:
  file.recurse:
    - name: {{ pillar['srv_dir'] }}/static/bundles
    - source: salt://website/bundles
    - user: root
    - group: root
    - file-mode: 0600
    - exclude_pat: '*.pyc'

Remove css destination:
  file.absent:
    - name: {{ pillar['srv_dir'] }}/static/css

Create css destination:
  file.directory:
    - name: {{ pillar['srv_dir'] }}/static/css

Copy css:
  file.recurse:
    - name: {{ pillar['srv_dir'] }}/static/css
    - source: salt://website/css
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
