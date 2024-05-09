/*
  Warnings:

  - You are about to drop the column `u_token` on the `legacy_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `legacy_users` DROP COLUMN `u_token`;

-- CreateTable
CREATE TABLE `lm_marker` (
    `m_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `m_name` VARCHAR(191) NOT NULL,
    `m_profile` VARCHAR(191) NOT NULL,
    `m_dob` DATETIME(3) NOT NULL,
    `m_dod` DATETIME(3) NOT NULL,
    `about_m` VARCHAR(191) NOT NULL,
    `rel_profile` VARCHAR(191) NOT NULL,
    `rel_name` VARCHAR(191) NOT NULL,
    `relationship` VARCHAR(191) NOT NULL,
    `rel_link` VARCHAR(191) NOT NULL,
    `place_city` VARCHAR(191) NOT NULL,
    `place_state` VARCHAR(191) NOT NULL,
    `start_place` DATETIME(3) NOT NULL,
    `end_place` DATETIME(3) NOT NULL,
    `inst_name` VARCHAR(191) NOT NULL,
    `start_edu` DATETIME(3) NOT NULL,
    `end_edu` DATETIME(3) NOT NULL,
    `eulogy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`m_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
