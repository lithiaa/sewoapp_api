/*
  Warnings:

  - Added the required column `capacity` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `features` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specification` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vehicles` ADD COLUMN `capacity` INTEGER NOT NULL,
    ADD COLUMN `features` MEDIUMTEXT NOT NULL,
    ADD COLUMN `specification` MEDIUMTEXT NOT NULL,
    ADD COLUMN `transmission` ENUM('MANUAL', 'AUTOMATIC', 'HYBRID') NOT NULL;
