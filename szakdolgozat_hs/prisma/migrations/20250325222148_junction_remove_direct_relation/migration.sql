/*
  Warnings:

  - You are about to drop the `_imageurltoproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `_imageurltoproduct`;

-- AddForeignKey
ALTER TABLE `imageurl` ADD CONSTRAINT `imageurl_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
