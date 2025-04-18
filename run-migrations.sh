#!/bin/bash

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate

# Run seeders
echo "Running seeders..."
npx sequelize-cli db:seed:all 