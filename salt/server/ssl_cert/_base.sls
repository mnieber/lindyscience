Add letsencrypt ppa:
  pkgrepo.managed:
    - ppa: certbot/certbot

Install apache letsencrypt packages:
  pkg.installed:
    - pkgs:
      - software-properties-common
      - python-certbot-apache
      - ssl-cert-check

Make strong Diffie-Hellman Group if not present:
  cmd.run:
    - name: openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
    - creates: /etc/ssl/certs/dhparam.pem

{% for letsencrypt_server_domain in [pillar['letsencrypt_server_domain']] %}
{% with cert_file = "/etc/letsencrypt/live/" + letsencrypt_server_domain + "/cert.pem" %}

Get SSL certificates for {{ letsencrypt_server_domain }}:
  cmd.run:
    - name: certbot --apache certonly --renew-by-default --email {{ pillar['letsencrypt_email'] }} --text --agree-tos -d {{ letsencrypt_server_domain }}
    - creates: {{ cert_file }}

{% endwith %}
{% endfor %}
