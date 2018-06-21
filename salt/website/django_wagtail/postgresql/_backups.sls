---
Install backupninja psql configuration:
  file.managed:
    - name: /etc/backup.d/dumps.pgsql
    - source: salt://website/django_wagtail/postgresql/dumps.pgsql
    - makedirs: True
