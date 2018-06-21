Setup cron job for SSL certificates renewal:
  cron.present:
    - name: certbot renew >> /var/log/letsencrypt-renew.log
    - dayweek: 0
    - hour: 2
    - comment: "Renew LetsEncrypt SSL certificates, if necessary"

Setup cron job to restart apache after (possible) SSL certificate renewal:
  cron.present:
    - name: service apache2 reload
    - dayweek: 0
    - hour: 2
    - minute: 5
    - comment: Restart apache after (possible) SSL certificate renewal
