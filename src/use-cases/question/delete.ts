import { QuestionRepository } from '@/repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
  question_id: string
}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionRepository) {}

  async execute({ question_id }: DeleteQuestionUseCaseRequest): Promise<{}> {
    await this.questionsRepository.delete(question_id)

    return {}
  }
}
