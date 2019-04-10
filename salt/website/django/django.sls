---
include:
  - website.django._base
{% if grains['id'] != 'dev' %}
  - website.django._pip_packages
  - website.django._configure
{% endif %}
  - website.django.memcached.memcached
  - website.django.postgresql.postgresql
