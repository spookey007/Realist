-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Alter the Services table to use UUID as default for id
ALTER TABLE "Services" 
    ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
    ALTER COLUMN id SET NOT NULL; 