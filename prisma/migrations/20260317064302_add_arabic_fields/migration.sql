-- AlterTable
ALTER TABLE "Banner" ADD COLUMN "descriptionAr" TEXT;
ALTER TABLE "Banner" ADD COLUMN "subtitleAr" TEXT;
ALTER TABLE "Banner" ADD COLUMN "titleAr" TEXT;

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN "descriptionAr" TEXT;
ALTER TABLE "Brand" ADD COLUMN "nameAr" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "descriptionAr" TEXT;
ALTER TABLE "Category" ADD COLUMN "nameAr" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "careInstructionsAr" TEXT;
ALTER TABLE "Product" ADD COLUMN "descriptionAr" TEXT;
ALTER TABLE "Product" ADD COLUMN "materialsAr" TEXT;
ALTER TABLE "Product" ADD COLUMN "nameAr" TEXT;
