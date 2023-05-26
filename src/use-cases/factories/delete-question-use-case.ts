import { PrismaQuestionRepository } from '@/repositories/prisma/prisma-question-repository'
import { DeleteQuestionUseCase } from '../question/delete'

export async function deleteQuestionUseCase() {
  const questionRepository = new PrismaQuestionRepository()
  const sut = new DeleteQuestionUseCase(questionRepository)

  return sut
}
