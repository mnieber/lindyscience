Allow remote connections to the database:
    cmd.run:
      - name: echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.5/main/pg_hba.conf

Add listen_addresses:
    cmd.run:
      - name: echo "listen_addresses='*'" >> /etc/postgresql/9.5/main/postgresql.conf
