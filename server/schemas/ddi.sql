-- Table: ddi
-- Table of interactions between drug

-- Drop table if exists (optional)
-- DROP TABLE IF EXISTS ddi;

-- Create the ddi table
CREATE TABLE IF NOT EXISTS ddi(
    interaction_id integer UNIQUE PRIMARY KEY,
    drug_one VARCHAR(75),
    drug_two VARCHAR(75),
    interaction VARCHAR(500)
);