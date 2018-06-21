---
Install tzdata:
  pkg.installed:
    - pkgs:
      - tzdata

Set localtime to {{ pillar['timezone'] }}:
  file.symlink:
    - name: /etc/localtime
    - target: /usr/share/zoneinfo/{{ pillar['timezone'] }}
    - force: True
    - file_mode: '0644'

Set timezone to {{ pillar['timezone'] }}:
  file.serialize:
    - name: /etc/timezone
    - dataset_pillar: timezone
    - force: True
    - file_mode: '0644'

Update timezone:
  cmd.run:
    - name: dpkg-reconfigure --frontend noninteractive tzdata

Create locale:
  locale.present:
    - name: en_US.UTF-8
