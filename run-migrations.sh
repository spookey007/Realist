#!/bin/bash

# Run migrations
echo "Running migrations..."
node server/db/migrate.cjs

# Run seeders
echo "Running seeders..."
node server/db/seed.cjs 