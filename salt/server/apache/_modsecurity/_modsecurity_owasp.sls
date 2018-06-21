---
Install OWASP Core Rule Set:
  archive.extracted:
    - name: /etc/modsecurity/owasp
    - source: https://github.com/SpiderLabs/owasp-modsecurity-crs/tarball/2.2.9
    - options: --strip-components=1
    - archive_format: tar
    - skip_verify: True
    - enforce_toplevel: False
    - unless: test -f /etc/modsecurity/owasp/LICENSE

Rename example conf:
  file.rename:
    - name: /etc/modsecurity/owasp/modsecurity_crs_10_setup.conf
    - source: /etc/modsecurity/owasp/modsecurity_crs_10_setup.conf.example

{% for subdir in ['base_rules', 'optional_rules'] %}
Copy {{ subdir }} to activated OWASP rules:
  file.directory:
    - name: /etc/modsecurity/activated_rules
  cmd.run:
    - name: cp /etc/modsecurity/owasp/{{ subdir }}/* /etc/modsecurity/activated_rules/
{% endfor %}

# crs 16 gives error: disruptive actions can only be specified by chain starter rules
# crs 41, 43 prevent the wordpress admin console from showing up.
# crs 20 prevents changing the worpress permalinks setting
# crs 50, 60 prevents the wordpress general settings panel from showing up
# crs 21, 55 prevent the installation of the stripe plugin
# crs 55 prevents exeucution of wp-cron.php
# crs 40 prevents adding a stripe payment processor
# crs 30 blocks /wp-admin/admin.php
{% for f in [
  '/etc/modsecurity/activated_rules/modsecurity_crs_16_session_hijacking.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_41_sql_injection_attacks.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_43_csrf_protection.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_20_protocol_violations.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_50_outbound.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_60_correlation.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_21_protocol_anomalies.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_55_application_defects.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_40_generic_attacks.conf',
  '/etc/modsecurity/activated_rules/modsecurity_crs_30_http_policy.conf'
] %}

Remove {{ f }}:
  file.absent:
    - name: {{ f }}
{% endfor %}

Add OWASP rules to Apache2:
  file.line:
    - name: /etc/apache2/mods-available/security2.conf
    - content: Include "/etc/modsecurity/activated_rules/*.conf"
    - mode: ensure
    - location: end

{% for mod in ['headers', 'security2'] %}
Enable mod {{ mod }}:
  apache_module.enabled:
    - name: {{ mod }}
{% endfor %}
