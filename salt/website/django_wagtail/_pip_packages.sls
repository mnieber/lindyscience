---
Install django python packages:
  cmd.run:
    - name: {{ pillar['srv_dir'] }}/env/bin/pip install -r requirements.txt
    - cwd: {{ pillar['srv_dir'] }}/src/django
