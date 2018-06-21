---
Create srv directory:
  file.directory:
    - name: {{ pillar['srv_dir'] }}

Record name tag on remote server:
  file.managed:
    - name: /{{ pillar['srv_dir'] }}/servername.txt
    - contents:
      - {{ grains['id'] }}
