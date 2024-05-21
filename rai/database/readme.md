# Spin up Docker Container to host Database for Development
docker-compose up

## Pro tip
if you change generateDatabase.sql to update database schema rerun "docker-compose up" to update db automatically

# If you change docker image in compose force rebuild
sudo docker-compose down -v
sudo docker-compose up --build
