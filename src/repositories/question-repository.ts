import { Prisma, Question } from '@prisma/client'

export interface QuestionRepository {
  create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question>
  update(
    questionId: string,
    data: Prisma.QuestionUpdateInput,
  ): Promise<Question | null>
  delete(questionId: string): Promise<{}>
}
