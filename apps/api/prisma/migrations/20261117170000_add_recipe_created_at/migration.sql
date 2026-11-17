-- Add the column without inventing creation dates for existing rows.
-- Verified source dates are restored by the following data migration.
ALTER TABLE "recipes" ADD COLUMN "created_at" TIMESTAMP(3);

-- Only future inserts that omit the column receive a creation timestamp.
ALTER TABLE "recipes" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
