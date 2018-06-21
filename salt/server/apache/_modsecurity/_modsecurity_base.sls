---
Install ModSecurity:
  pkg.installed:
    - pkgs:
      - libxml2
      - libxml2-dev
      - libxml2-utils
      - libaprutil1
      - libaprutil1-dev
      - libapache2-mod-security2

Install recommended configuration:
  file.rename:
    - name: /etc/modsecurity/modsecurity.conf
    - source: /etc/modsecurity/modsecurity.conf-recommended

{% for pattern, content in [
  ('^SecRuleEngine\\\\s', 'SecRuleEngine On'),
  ('^SecServerSignature\\\\s', 'SecServerSignature FreeOSHTTP'),
  ('^SecRequestBodyLimit\\\\s', 'SecRequestBodyLimit 16384000'),
  ('^SecRequestBodyInMemoryLimit\\\\s', 'SecRequestBodyInMemoryLimit 16384000'),
] %}

Add line to modsecurity.conf -> {{ pattern }}:
  file.line:
    - name: /etc/modsecurity/modsecurity.conf
    - match: {{ pattern }}
    - content: {{ content }}
    - mode: ensure
    - location: end
{% endfor %}
