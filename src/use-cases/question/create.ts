import { QuestionRepository } from '@/repositories/question-repository'
import { Question } from '@prisma/client'

interface CreateQuestionUseCaseRequest {
  title: string
  content: string
  slug: string
  anonymous: boolean
  votes: number
  user_id: string
}
interface CreateQuestionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    title,
    content,
    slug = '',
    anonymous = false,
    votes = 0,
    user_id,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    if (!title) {
      throw new Error('title are required')
    }

    if (!content) {
      throw new Error('content are required')
    }

    const question = await this.questionRepository.create({
      title,
      content,
      slug,
      anonymous,
      votes,
      user_id,
    })

    return {
      question,
    }
  }
}
