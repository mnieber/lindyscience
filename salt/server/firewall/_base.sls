---
Install required packages:
  pkg.installed:
    - pkgs:
      - fail2ban
      - ufw

{% for port in [22, 80, 443] %}
Allow port {{ port }} through ufw:
  cmd.run:
    - name: ufw allow {{ port }}/tcp
{% endfor %}

Setup ufw firewall:
  cmd.run:
    - name: ufw default deny

Enable firewall:
  cmd.run:
    - name: ufw enable
