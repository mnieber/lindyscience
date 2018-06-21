---
include:
  - website.django_wagtail.postgresql._base
{% if grains['id'] == 'dev' %}
  - website.django_wagtail.postgresql._docker
{% endif %}
  - website.django_wagtail.postgresql._supervisor
  - website.django_wagtail.postgresql._create_database
  - website.django_wagtail.postgresql._backups
