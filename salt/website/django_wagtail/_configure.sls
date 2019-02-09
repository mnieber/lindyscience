---
Create migrations_local directory:
  file.directory:
    - name: /srv/linsci/migrations_local

Django migrate:
  cmd.run:
    - name: /srv/linsci/env/bin/python manage.py migrate-local
    - cwd: /srv/linsci/src/website/django_wagtail
    - env:
      - DJANGO_SETTINGS_MODULE: 'app.settings.prod'

Collect static files:
  cmd.run:
    - name: /srv/linsci/env/bin/python manage.py collectstatic --noinput
    - cwd: /srv/linsci/src/website/django_wagtail
    - env:
      - DJANGO_SETTINGS_MODULE: 'app.settings.prod'
