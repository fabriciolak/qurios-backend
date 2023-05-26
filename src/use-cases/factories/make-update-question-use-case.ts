import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { UpdateQuestionUseCase } from '../question/update'

export async function makeUpdateQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository()
  const sut = new UpdateQuestionUseCase(questionRepository)

  return sut
}
