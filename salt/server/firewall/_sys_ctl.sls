---
Harden network with sysctl settings:
  file.managed:
    - name: /etc/sysctl.conf
    - source: salt://server/firewall/sysctl.conf
