import { QuestionRepository } from '@/repositories/question-repository'
import { Question } from '@prisma/client'

interface UpdateQuestionUseCaseRequest {
  questionId: string
  data: {
    title?: string
    content?: string
    slug?: string
    anonymous?: boolean
    updated_at: Date
  }
}

interface UpdateQuestionUseCaseResponse {
  question: Question | null
}

export class UpdateQuestionUseCase {
  constructor(private questionsRepository: QuestionRepository) {}

  async execute({
    questionId,
    data,
  }: UpdateQuestionUseCaseRequest): Promise<UpdateQuestionUseCaseResponse> {
    if (!questionId) {
      throw new Error('question id are required')
    }

    const question = await this.questionsRepository.update(questionId, data)

    if (!question) {
      throw new Error('Resource not found')
    }

    return {
      question,
    }
  }
}
