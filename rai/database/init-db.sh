#!/bin/bash
set -e

# Run the main container command
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to start
until pg_isready -h localhost -p 5432; do
  sleep 1
done

# Run the SQL script
if [ -f /docker-entrypoint-initdb.d/generateDatabase.sql ]; then
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/generateDatabase.sql
fi

# Keep the container running
wait
