/*
  Warnings:

  - You are about to drop the column `partner_id` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `mitra_id` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `vehicles` DROP FOREIGN KEY `vehicles_partner_id_fkey`;

-- DropIndex
DROP INDEX `vehicles_partner_id_fkey` ON `vehicles`;

-- AlterTable
ALTER TABLE `vehicles` DROP COLUMN `partner_id`,
    ADD COLUMN `mitra_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `mitra_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `mitra_image` VARCHAR(191) NOT NULL,
    `mitra_name` VARCHAR(191) NOT NULL,
    `mitra_address` VARCHAR(191) NOT NULL,
    `mitra_description` MEDIUMTEXT NULL,
    `general_information` MEDIUMTEXT NULL,
    `operating_hours` VARCHAR(191) NOT NULL,
    `contact_number` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `latitude` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mitra_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mitra_profiles` ADD CONSTRAINT `mitra_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_mitra_id_fkey` FOREIGN KEY (`mitra_id`) REFERENCES `mitra_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
