Apache SSL Hardening - disable SSL v2/v3 support:
  file.line:
    - name: '/etc/apache2/mods-available/ssl.conf'
    - mode: replace
    - match: SSLProtocol
    - content: 'SSLProtocol all -SSLv3'

{% for module in ['ssl'] %}
Enable apache module {{ module }}:
  apache_module.enabled:
    - name: {{ module }}
{% endfor %}
