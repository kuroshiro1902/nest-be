# Create database with docker

docker exec postgres_service psql -U postgres -d postgres -c "CREATE DATABASE \"orbity\";"
