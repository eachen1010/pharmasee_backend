-- Table: patients
-- patient table with mrn (Patient id) and basic patient information

-- Drop the table if it exists (optional)
-- DROP TABLE IF EXISTS patients;

-- Create the table
CREATE TABLE IF NOT EXISTS patients
(
    mrn UNIQUE PRIMARY KEY, -- Use 'serial' for auto-incrementing primary key
    birthdate VARCHAR(50),
    sex VARCHAR(1),
    first_name INTEGER,
    last_name VARCHAR(256)
);