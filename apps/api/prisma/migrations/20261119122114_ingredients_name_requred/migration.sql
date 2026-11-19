/*
  Warnings:

  - Made the column `name` on table `ingredients` required. This step will fail if there are existing NULL values in that column.

*/

UPDATE "ingredients" 
SET "name" = 'Unknown' 
WHERE "name" IS NULL;

-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "name" SET NOT NULL;
