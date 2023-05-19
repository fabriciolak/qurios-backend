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

    this.questions.push(question)

    return question
  }

  async update(
    questionId: string,
    data: Omit<Question, 'owner_id' | 'id' | 'slug' | 'votes'>,
  ): Promise<Question | null> {
    const questionIndex = this.questions.findIndex(
      (question) => question.id === questionId,
    )

    if (questionIndex === -1) {
      return null
    }

    const updatedQuestion = {
      ...this.questions[questionIndex],
      title:
        data.title !== undefined
          ? String(data.title)
          : this.questions[questionIndex].title,
      updated_at:
        data.updated_at !== undefined
          ? data.updated_at
          : this.questions[questionIndex].updated_at,
    }

    this.questions[questionIndex] = updatedQuestion

    return updatedQuestion
  }

  async delete(questionId: string): Promise<{}> {
    const questionToDeleteIndex = this.questions.findIndex(
      (question) => question.id === questionId,
    )

    if (questionToDeleteIndex !== -1) {
      this.questions.splice(questionToDeleteIndex, 1)
    }

    return {}
  }
}
