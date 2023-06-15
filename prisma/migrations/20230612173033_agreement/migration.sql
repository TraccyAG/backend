/*
  Warnings:

  - The `file` column on the `Agreement` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "file",
ADD COLUMN     "file" BYTEA;
