import { Question, Prisma } from '@prisma/client'
import { QuestionRepository } from '../question-repository'
import { prisma } from '@/lib/prisma'

export class PrismaQuestionRepository implements QuestionRepository {
  async create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question> {
    const question = await prisma.question.create({
      data,
    })

    return question
  }

  update(
    questionId: string,
    data: Prisma.QuestionUpdateInput,
  ): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }

  delete(questionId: string): Promise<{}> {
    throw new Error('Method not implemented.')
  }
}
