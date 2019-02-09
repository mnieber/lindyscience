---
Create destination for copying source files:
  file.directory:
    - name: /srv/linsci/src

Copy website source files:
  file.recurse:
    - name: /srv/linsci/src/website
    - source: salt://website/source_files
    - user: root
    - group: root
    - file-mode: 0600
    - exclude_pat: '*.pyc'

Record git sha on remote server:
  file.managed:
    - name: /srv/linsci/deployed_version.txt
    - contents:
      - {{ pillar['git_sha'] }}
