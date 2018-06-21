---
Install unattended upgrades:
  pkg.installed:
    - name: unattended-upgrades
  file.managed:
    - name: /etc/apt/apt.conf.d/10periodic
    - source: salt://system/unattended_upgrades/apt-periodic
