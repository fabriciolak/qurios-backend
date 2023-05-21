import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { CreateQuestionUseCase } from '../question/create'

export async function makeCreateQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository()
  const sut = new CreateQuestionUseCase(questionRepository)

  return sut
}
