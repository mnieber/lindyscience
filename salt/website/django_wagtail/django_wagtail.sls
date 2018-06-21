---
include:
  - website.django_wagtail._base
{% if grains['id'] != 'dev' %}
  - website.django_wagtail._pip_packages
  - website.django_wagtail._configure
{% endif %}
  - website.django_wagtail.memcached.memcached
  - website.django_wagtail.postgresql.postgresql
