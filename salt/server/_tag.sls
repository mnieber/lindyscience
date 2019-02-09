---
Create srv directory:
  file.directory:
    - name: /srv/linsci

Record name tag on remote server:
  file.managed:
    - name: //srv/linsci/servername.txt
    - contents:
      - {{ grains['id'] }}
