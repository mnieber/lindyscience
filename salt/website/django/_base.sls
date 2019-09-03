---
Install django apt packages:
  pkg.installed:
    - pkgs:
      - python-dev
      - locales
      - libxml2-dev
      - libxslt1-dev
      - zlib1g-dev
      - sqlite
      - python3
      - python3-pip
      - ipython3
      - python3-dev
      - virtualenv
      - libpq-dev

Install django virtual env:
  virtualenv.managed:
    - name: {{ pillar['srv_dir'] }}/env
    - python: python3
    - system_site_packages: False
    - pip_upgrade: True

Create django log dir:
  file.directory:
    - name: {{ pillar['srv_dir'] }}/log