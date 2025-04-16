#!/bin/bash

# This script fixes the NATS connection URLs in all microservices
# It replaces any default localhost URLs with the Docker service name

# List of directories containing microservices
SERVICES=("transaction-service" "auth-service" "budget-service" "analytics-service" "ai-insights-service" "api-gateway")

for SERVICE in "${SERVICES[@]}"; do
  echo "Fixing NATS connection in $SERVICE"
  
  # Find all TypeScript files with NATS configuration
  find "./$SERVICE" -type f -name "*.ts" -exec grep -l "nats://" {} \; | while read -r FILE; do
    echo "  Updating $FILE"
    
    # Replace any localhost or 127.0.0.1 NATS URLs with nats:4222
    sed -i.bak 's/nats:\/\/localhost:4222/nats:\/\/nats:4222/g' "$FILE"
    sed -i.bak 's/nats:\/\/127.0.0.1:4222/nats:\/\/nats:4222/g' "$FILE"
    
    # Remove backup files
    rm -f "$FILE.bak"
  done
done

echo "NATS connection URLs fixed in all services"