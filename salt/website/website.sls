---
include:
  - website._apt
  - website._source_files
  - website._yarn
{% if grains['id'] != 'dev' %}
  - website._npm_packages
{% endif %}
  - website.django.django
  - website._apache._apache
