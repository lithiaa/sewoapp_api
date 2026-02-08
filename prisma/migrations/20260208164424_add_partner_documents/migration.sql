-- CreateTable
CREATE TABLE `PartnerDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mitra_id` INTEGER NOT NULL,
    `nib_document_url` VARCHAR(191) NOT NULL,
    `npwp_document_url` VARCHAR(191) NOT NULL,
    `bank_account_document_url` VARCHAR(191) NOT NULL,
    `business_address` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PartnerDocument_mitra_id_key`(`mitra_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PartnerDocument` ADD CONSTRAINT `PartnerDocument_mitra_id_fkey` FOREIGN KEY (`mitra_id`) REFERENCES `mitra_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
