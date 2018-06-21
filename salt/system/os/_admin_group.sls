---
Add admin group:
  group.present:
    - name: admin
    - addusers:
      - root

Protect su by limiting access only to admin group:
  file.line:
    - name: /var/lib/dpkg/statoverride
    - content: 'root admin 4750 /bin/su'
    - mode: ensure
    - location: end
