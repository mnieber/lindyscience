---
Install memcached apt packages:
  pkg.installed:
    - pkgs:
      - memcached

Install memcached.conf:
  file.managed:
    - name: /etc/memcached.conf
    - source: salt://website/django_wagtail/memcached/memcached.conf

Install memcached supervisor conf:
  file.managed:
    - name: /etc/supervisor/conf.d/supervisor-memcached.conf
    - source: salt://website/django_wagtail/memcached/supervisor-memcached.conf
