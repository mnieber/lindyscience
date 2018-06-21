---
Prevent IP Spoofing:
  file.managed:
    - name: /etc/host.conf
    - source: salt://server/firewall/host.conf
