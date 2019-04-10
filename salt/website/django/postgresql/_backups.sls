---
Install backupninja psql configuration:
  file.managed:
    - name: /etc/backup.d/dumps.pgsql
    - source: salt://website/django/postgresql/dumps.pgsql
    - makedirs: True
