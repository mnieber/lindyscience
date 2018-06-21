---
include:
  - server.apache.apache
  - server._tag
{% if grains['id'] != 'dev' %}
  - server.firewall.firewall
{% endif %}

exclude:
  - foo