psql {{ pillar['postgresql_dbname'] }} -c "ALTER ROLE {{ pillar['postgresql_dbuser'] }} SET client_encoding TO 'utf8';"
psql {{ pillar['postgresql_dbname'] }} -c "ALTER ROLE {{ pillar['postgresql_dbuser'] }} SET default_transaction_isolation TO 'read committed';"
psql {{ pillar['postgresql_dbname'] }} -c "ALTER ROLE {{ pillar['postgresql_dbuser'] }} SET timezone TO 'UTC';"