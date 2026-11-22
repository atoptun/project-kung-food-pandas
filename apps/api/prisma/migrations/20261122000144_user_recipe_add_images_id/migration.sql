-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "thumb_id" TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarId" TEXT;
