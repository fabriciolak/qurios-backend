/*
  Warnings:

  - You are about to drop the column `owner_id` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `questions` table. All the data in the column will be lost.
  - You are about to alter the column `slug` on the `questions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `user_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_owner_id_fkey";

-- DropIndex
DROP INDEX "questions_slug_key";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "owner_id",
DROP COLUMN "published_at",
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "votes" DROP NOT NULL,
ALTER COLUMN "anonymous" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;