Create a password for restricted locations:
  cmd.run:
    - name: htpasswd -b -c /etc/apache2/.htpasswd {{ pillar['org_name'] }} {{ pillar['apache_password'] }}
