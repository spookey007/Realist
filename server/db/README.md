# Database Seeders

This directory contains database migrations and seeders for the Realist application.

## Migrations

Migrations are used to create and modify database tables. They are stored in the `migrations` directory.

## Seeders

Seeders are used to populate the database with initial data. They are stored in the `seeders` directory.

### Available Seeders

- `20250415000001-seed-service-types.js`: Seeds service types
- `20250415000002-seed-services.js`: Seeds services

### Running Seeders

You can run the seeders using the following npm scripts:

```bash
# Run all seeders
npm run db:seed

# Undo all seeders
npm run db:seed:undo

# Run migrations
npm run db:migrate

# Undo all migrations
npm run db:migrate:undo
```

### Using Sequelize CLI

You can also use Sequelize CLI directly:

```bash
# Run a specific seeder
npx sequelize-cli db:seed --seed 20250415000001-seed-service-types.js

# Undo a specific seeder
npx sequelize-cli db:seed:undo --seed 20250415000001-seed-service-types.js
```

## Database Schema

### ServiceTypes

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| service_type_name | STRING | Name of the service type |
| status | INTEGER | Status (1 = active, 0 = inactive) |
| created_at | DATE | Creation timestamp |
| updatedAt | DATE | Update timestamp |

### Services

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| service_name | STRING | Name of the service |
| description | TEXT | Description of the service |
| service_type_id | UUID | Foreign key to ServiceTypes |
| created_by | INTEGER | User ID who created the service |
| status | INTEGER | Status (1 = active, 0 = inactive) |
| created_at | DATE | Creation timestamp |
| updatedAt | DATE | Update timestamp | 