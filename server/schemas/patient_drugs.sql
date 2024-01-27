-- Table: patient_drugs
-- there's no way to put a list in a table so the only thing we can do is create another table LOL

-- Drop the table if it exists (optional)
-- DROP TABLE IF EXISTS patient_drugs;

-- Create the table
CREATE TABLE IF NOT EXISTS patient_drugs
(
    mrn PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR(256),
    drug_id INTEGER NOT NULL
);