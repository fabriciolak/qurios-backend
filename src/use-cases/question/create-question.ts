import { QuestionRepository } from '@/repositories/question-repository'
import { Question } from '@prisma/client'

interface CreateQuestionUseCaseRequest {
  title: string
  content: string
  slug: string
  anonymous: boolean
  votes: number
  owner_id: string
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
    owner_id,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    if (!title) {
      throw new Error('no title specified')
    }

    if (!content) {
      throw new Error('no content specified')
    }

    const question = await this.questionRepository.create({
      title,
      content,
      slug,
      anonymous,
      votes,
      owner_id,
    })

    return {
      question,
    }
  }
}
