/*
  Warnings:

  - You are about to drop the column `saled_items` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "saled_items",
ADD COLUMN     "sold_items" INTEGER NOT NULL DEFAULT 0;
