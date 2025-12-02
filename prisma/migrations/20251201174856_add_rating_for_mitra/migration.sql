-- CreateTable
CREATE TABLE `mitra_ratings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `mitra_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `review` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mitra_ratings_customer_id_mitra_id_key`(`customer_id`, `mitra_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mitra_ratings` ADD CONSTRAINT `mitra_ratings_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mitra_ratings` ADD CONSTRAINT `mitra_ratings_mitra_id_fkey` FOREIGN KEY (`mitra_id`) REFERENCES `mitra_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
