/*
  Warnings:

  - Added the required column `description_tsvector` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_tsvector` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- 1. Adiciona as colunas (caso ainda não existam)
ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "name_tsvector" tsvector,
  ADD COLUMN IF NOT EXISTS "description_tsvector" tsvector;

-- 2. Atualiza os valores existentes
UPDATE "products"
SET
  "name_tsvector" = to_tsvector('portuguese', coalesce("name", '')),
  "description_tsvector" = to_tsvector('portuguese', coalesce("description", ''));

-- 3. Cria a função de trigger
CREATE OR REPLACE FUNCTION products_tsvector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.name_tsvector := to_tsvector('portuguese', coalesce(NEW.name, ''));
  NEW.description_tsvector := to_tsvector('portuguese', coalesce(NEW.description, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 4. Cria o trigger para INSERT/UPDATE
DROP TRIGGER IF EXISTS products_tsvector_update ON "products";
CREATE TRIGGER products_tsvector_update
BEFORE INSERT OR UPDATE OF name, description
ON "products"
FOR EACH ROW EXECUTE FUNCTION products_tsvector_trigger();


-- CreateIndex
CREATE INDEX "products_name_tsvector_idx" ON "products" USING GIN ("name_tsvector");

-- CreateIndex
CREATE INDEX "products_description_tsvector_idx" ON "products" USING GIN ("description_tsvector");
