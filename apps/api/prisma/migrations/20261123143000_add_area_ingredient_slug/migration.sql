-- AlterTable
ALTER TABLE "areas" ADD COLUMN     "slug" VARCHAR(120);

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "slug" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "areas_slug_key" ON "areas"("slug");

-- CreateIndex
CREATE INDEX "areas_slug_idx" ON "areas"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_slug_key" ON "ingredients"("slug");

-- CreateIndex
CREATE INDEX "ingredients_slug_idx" ON "ingredients"("slug");
