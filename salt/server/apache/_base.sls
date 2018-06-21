Install apache packages:
  pkg.installed:
    - pkgs:
      - apache2
      - apache2-utils

Set ServerName:
  file.line:
    - name: /etc/apache2/apache2.conf
    - content: 'ServerName localhost'
    - mode: ensure
    - location: end
    - match: ServerName

Restrict Apache Information Leakage:
  file.managed:
    - name: /etc/apache2/conf-available/security.conf
    - source: salt://server/apache/security.conf

Disable default site:
  apache_site.disabled:
    - name: 000-default

{% for module in ['headers', 'rewrite', 'proxy_http'] %}
Enable apache module {{ module }}:
  apache_module.enabled:
    - name: {{ module }}
{% endfor %}
