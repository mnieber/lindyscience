---
Reload services:
  cmd.run:
    - name: supervisorctl reload

Restart services:
  cmd.run:
    - name: supervisorctl restart all
