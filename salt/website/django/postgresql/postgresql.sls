---
include:
  - website.django.postgresql._base
{% if grains['id'] == 'dev' %}
  - website.django.postgresql._docker
{% endif %}
  - website.django.postgresql._supervisor
  - website.django.postgresql._create_database
  - website.django.postgresql._backups
