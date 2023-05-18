import { QuestionRepository } from '@/repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
  questionId: string
}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionRepository) {}

  async execute({ questionId }: DeleteQuestionUseCaseRequest): Promise<{}> {
    if (!questionId) {
      throw new Error('question id are required')
    }

    await this.questionsRepository.delete(questionId)

    return {}
  }
}
