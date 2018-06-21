Copy alert_low_disk_space:
  file.managed:
    - name: /root/alert_low_disk_space.sh
    - source: salt://system/alerts/alert_low_disk_space.sh
    - mode: 0700

Create alert_low_disk_space crontab:
  cron.present:
    - name: /root/alert_low_disk_space.sh
    - hour: 15
    - minute: 1

