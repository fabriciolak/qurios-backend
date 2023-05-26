import { Prisma, Question } from '@prisma/client'

export interface QuestionRepository {
  create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question>
  update(
    questionId: string,
    data: Prisma.QuestionUpdateInput,
  ): Promise<Question | null | undefined>
  delete(questionId: string): Promise<{} | undefined>
  findBySlug(slug: string): Promise<Question | null>
}
