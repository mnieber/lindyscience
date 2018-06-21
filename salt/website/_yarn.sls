Install node prerequisites:
  pkg.installed:
    - pkgs:
      - curl
      - sudo

Add apt key for node:
  cmd.run:
    - name: curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

Install node:
  pkg.installed:
    - pkgs:
      - nodejs

Install yarn:
  cmd.run:
    - name: npm install --global yarn
