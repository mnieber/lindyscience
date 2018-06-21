---
Install postgres supervisor configuration:
  file.managed:
    - name: /etc/supervisor/conf.d/supervisor-postgresql.conf
    - source: salt://website/django_wagtail/postgresql/supervisor-postgresql.conf

Start postgresql:
  cmd.run:
    - name: supervisorctl reload && sleep 6

Check status:
  cmd.run:
    - name: supervisorctl status
