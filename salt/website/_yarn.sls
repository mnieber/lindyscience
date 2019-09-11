Install node prerequisites:
  pkg.installed:
    - pkgs:
      - curl
      - sudo

Install node:
  pkg.installed:
    - pkgs:
      - nodejs
      - npm

Install yarn:
  cmd.run:
    - name: npm install --global yarn
