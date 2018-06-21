---
Secure shared memory:
  file.line:
    - name: /etc/fstab
    - content: 'tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0'
    - mode: ensure
    - location: end

Disable password login:
  file.line:
    - name: /etc/ssh/sshd_config
    - match: ^#?PasswordAuthentication
    - content: PasswordAuthentication no
    - mode: replace
