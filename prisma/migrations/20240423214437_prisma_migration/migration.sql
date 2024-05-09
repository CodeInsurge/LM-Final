-- CreateTable
CREATE TABLE `legacy_users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `f_name` VARCHAR(191) NOT NULL,
    `l_name` VARCHAR(191) NOT NULL,
    `u_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `s_address` VARCHAR(191) NOT NULL,
    `apartment` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `zip_code` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `alt_email` VARCHAR(191) NOT NULL,
    `profile_photo_url` VARCHAR(191) NOT NULL,
    `cover_photo_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
