docker compose down --volumes --remove-orphans

docker system prune -f --volumes

echo "Reset completed successfully."
