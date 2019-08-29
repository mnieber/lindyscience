---
Django migrate:
  cmd.run:
    - name: {{ pillar['srv_dir'] }}/env/bin/python manage.py migrate
    - cwd: {{ pillar['srv_dir'] }}/src/django
    - env:
      - DJANGO_SETTINGS_MODULE: 'app.settings.prod'

Collect static files:
  cmd.run:
    - name: {{ pillar['srv_dir'] }}/env/bin/python manage.py collectstatic --noinput
    - cwd: {{ pillar['srv_dir'] }}/src/django
    - env:
      - DJANGO_SETTINGS_MODULE: 'app.settings.prod'
