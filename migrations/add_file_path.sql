-- Add file_path column to notices table
ALTER TABLE notices ADD COLUMN file_path VARCHAR(255) NULL AFTER created_by;

-- Add file_path column to assignments table  
ALTER TABLE assignments ADD COLUMN file_path VARCHAR(255) NULL AFTER created_by;
