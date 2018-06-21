---
Install ModEvasive:
  pkg.installed:
    - pkgs:
      - libapache2-mod-evasive

Create log file directory for mod_evasive:
  file.directory:
    - name: '/var/log/mod_evasive'
    - user: www-data
    - group: www-data

Create mod-evasive.conf file and configure ModEvasive:
  file.managed:
    - name: /etc/apache2/mods-available/evasive.conf
    - source: salt://server/apache/_modevasive/evasive.conf

Enable mod evasive:
  apache_module.enabled:
    - name: evasive
