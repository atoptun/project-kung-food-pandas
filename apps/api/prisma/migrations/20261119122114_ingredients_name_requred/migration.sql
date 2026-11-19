/*
  Warnings:

  - Made the column `name` on table `ingredients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "name" SET NOT NULL;
