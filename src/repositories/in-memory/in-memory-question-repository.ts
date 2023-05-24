import { Prisma, Question } from '@prisma/client'
import { QuestionRepository } from '../question-repository'
import { randomUUID } from 'crypto'
import { TitleSlugAlreadyExistsError } from '@/use-cases/errors/title-slug-already-exisits'

export class InMemoryQuestionRepository implements QuestionRepository {
  public questions: Question[] = []

  async create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question> {
    const question = {
      id: randomUUID(),
      title: data.title,
      content: data.content,
      anonymous: data.anonymous ?? false,
      created_at: new Date(),
      slug: data.slug ?? '',
      updated_at: null,
      votes: 0,
      user_id: data.anonymous ? '' : data.user_id,
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

  async findBySlug(slug: string): Promise<Question | null> {
    const questionIndex = this.questions.findIndex(
      (question) => question.slug === slug,
    )

    if (questionIndex !== -1) {
      throw new TitleSlugAlreadyExistsError()
    }

    return this.questions[questionIndex]
  }
}
