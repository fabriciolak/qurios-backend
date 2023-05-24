import { QuestionRepository } from '@/repositories/question-repository'
import { Question } from '@prisma/client'

interface UpdateQuestionUseCaseRequest {
  title?: string
  content?: string
  slug?: string
  anonymous?: boolean
  updated_at: Date
  user_id: string
}

interface UpdateQuestionUseCaseResponse {
  question: Question | null | undefined
}

export class UpdateQuestionUseCase {
  constructor(private questionsRepository: QuestionRepository) {}

  async execute(
    questionId: string,
    data: UpdateQuestionUseCaseRequest,
  ): Promise<UpdateQuestionUseCaseResponse> {
    if (!questionId) {
      throw new Error('question id are required')
    }

    const question = await this.questionsRepository.update(questionId, data)

    // if (!question) {
    //   throw new Error('Resource not found')
    // }

    return {
      question,
    }
  }
}
