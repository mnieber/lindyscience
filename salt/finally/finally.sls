---
include:
  - finally._record_deployed_version
{% if grains['id'] != 'dev' %}
  - finally._restart_services
{% endif %}
