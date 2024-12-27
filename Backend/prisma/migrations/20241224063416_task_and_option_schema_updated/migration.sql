/*
  Warnings:

  - Added the required column `image` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signature` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "signature" TEXT NOT NULL;
