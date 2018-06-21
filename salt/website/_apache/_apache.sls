---
Install gunicorn supervisor conf:
  file.managed:
    - name: /etc/supervisor/conf.d/supervisor-gunicorn.conf
    - source: salt://website/_apache/supervisor-gunicorn.conf

Add django apache configuration file:
  file.managed:
    - name: /etc/apache2/sites-available/apache-django.conf
    - source: salt://website/_apache/apache-django.local.conf
    - template: jinja

Enable apache django configuration file:
  apache_site.enabled:
    - name: apache-django
