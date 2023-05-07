import { Question } from '@prisma/client'
import { QuestionRepository } from '../question-repository'
import { randomUUID } from 'crypto'

export class InMemoryQuestionRepository implements QuestionRepository {
  public questions: Question[] = []

  async create(
    data: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'published_at'>,
  ): Promise<Question> {
    const question: Question = {
      id: randomUUID(),
      title: data.title,
      content: data.content,
      anonymous: data.anonymous ?? false,
      votes: data.votes ?? 0,
      created_at: new Date(),
      published_at: null,
      updated_at: null,
      slug: data.title.toLowerCase().trim(),
      owner_id: data.anonymous ? '' : data.owner_id,
    }

    console.log(question)

    this.questions.push(question)

    return question
  }
}
