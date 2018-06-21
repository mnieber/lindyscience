---
Create migrations_local directory:
  file.directory:
    - name: {{ pillar['srv_dir'] }}/migrations_local

Django migrate:
  cmd.run:
    - name: {{ pillar['srv_dir'] }}/env/bin/python manage.py migrate-local
    - cwd: {{ pillar['srv_dir'] }}/src/website/django_wagtail
    - env:
      - DJANGO_SETTINGS_MODULE: 'app.settings.prod'

Collect static files:
  cmd.run:
    - name: {{ pillar['srv_dir'] }}/env/bin/python manage.py collectstatic --noinput
    - cwd: {{ pillar['srv_dir'] }}/src/website/django_wagtail
    - env:
      - DJANGO_SETTINGS_MODULE: 'app.settings.prod'
