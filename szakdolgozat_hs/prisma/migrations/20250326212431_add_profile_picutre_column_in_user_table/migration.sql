-- AlterTable
ALTER TABLE `user` ADD COLUMN `profilePicture` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `imageurl` RENAME INDEX `imageurl_productId_fkey` TO `ImageUrl_productId_fkey`;
