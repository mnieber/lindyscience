Install apache supervisor conf:
  file.managed:
    - name: /etc/supervisor/conf.d/supervisor-apache.conf
    - source: salt://server/apache/_supervisor/supervisor-apache.conf
