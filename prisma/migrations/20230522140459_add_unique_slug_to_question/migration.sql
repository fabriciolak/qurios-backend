/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");
