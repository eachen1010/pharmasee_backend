-- Table: drugs
-- drug encyclopedia basically

-- Drop the table if it exists (optional)
-- DROP TABLE IF EXISTS drugs;

-- Create the table
CREATE TABLE IF NOT EXISTS drugs
(
    drug_id serial UNIQUE PRIMARY KEY, -- Use 'serial' for auto-incrementing primary key
    drug_name VARCHAR(256) NOT NULL,
    details VARCHAR(256)
);