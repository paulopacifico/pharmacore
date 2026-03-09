-- AlterTable
ALTER TABLE "branches" ADD COLUMN "cnpj" TEXT NOT NULL DEFAULT '11222333000181';

-- Remove default after backfill (optional - keeps default for future inserts without cnpj)
ALTER TABLE "branches" ALTER COLUMN "cnpj" DROP DEFAULT;
