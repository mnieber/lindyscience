---
Install postgres apt packages:
  pkg.installed:
    - pkgs:
      - python-dev
      - libpq-dev
      - postgresql
      - postgresql-server-dev-all

Prevent postgres warning "no such file or directory":
  file.directory:
    - name: /var/run/postgresql/10-main.pg_stat_tmp
    - user: postgres
