---
include:
  - server.apache._base
  - server.apache._ssl
  - server.apache._password
  - server.apache._supervisor._supervisor

exclude:
  - server.apache._modsecurity._modsecurity_base
  - server.apache._modsecurity._modsecurity_owasp
  - server.apache._modevasive._modevasive