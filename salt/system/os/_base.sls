---
Install system build tools:
  pkg.installed:
    - pkgs:
      - make
      - g++

Install system utilities:
  pkg.installed:
    - pkgs:
      - cron
      - curl
      - debconf-utils
      - ipython
      - ipython3
      - python-dev
      - python-pip
      - python3
      - python3-dev
      - python3-pip
      - sudo

Install system troubleshooting utilities:
  pkg.installed:
    - pkgs:
      - nano
      - locate
      - iputils-ping

Patch pip version:
  cmd.run:
  - name: pip install pip==9.0.1

Upgrade system pip:
  pip.installed:
    - name: pip
    - upgrade: True

Install system python packages:
  pip.installed:
    - name: plumbum
    - upgrade: True
