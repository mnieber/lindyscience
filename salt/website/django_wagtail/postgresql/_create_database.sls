---
Create database user:
  postgres_user.present:
    - name: {{ pillar['postgresql_dbuser'] }}
    - password: {{ pillar['postgresql_password'] }}
    - createdb: True
    - createroles: True
    - superuser: True
    - replication: True

Create database:
  postgres_database.present:
    - name: {{ pillar['postgresql_dbname'] }}
    - user: postgres

Change default postgres settings:
  cmd.script:
    - name: salt://website/django_wagtail/postgresql/alter-roles.sh
    - runas: postgres
    - template: jinja
