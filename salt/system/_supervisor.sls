---
Install supervisor packages:
  pkg.installed:
    - pkgs:
      - supervisor

Start supervisor:
  cmd.run:
    - name: service supervisor start; exit 0
