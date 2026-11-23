-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "slug" VARCHAR(120);

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "slug" VARCHAR(280);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes"("slug");

-- CreateIndex
CREATE INDEX "recipes_slug_idx" ON "recipes"("slug");
