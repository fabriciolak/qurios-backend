import { Question, Prisma } from '@prisma/client'
import { QuestionRepository } from '../question-repository'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/utils/generate-slug'
import { TitleSlugAlreadyExistsError } from '@/use-cases/errors/title-slug-already-exisits'
import { NotFoundError } from '@/use-cases/errors/not-found-error'

export class PrismaQuestionRepository implements QuestionRepository {
  async create(data: Prisma.QuestionUncheckedCreateInput): Promise<Question> {
    const question = await prisma.question.create({
      data,
    })

    return question
  }

  async update(
    questionId: string,
    data: Prisma.QuestionUpdateInput,
  ): Promise<Question | null | undefined> {
    try {
      const question = await prisma.$transaction(async (transaction) => {
        const questionToUpdate = await transaction.question.findFirst({
          where: {
            id: questionId,
          },
        })

        if (!questionToUpdate) {
          throw new NotFoundError()
        }

        const { user_id }: Question = questionToUpdate

        const user = await transaction.user.findFirst({
          where: {
            id: user_id,
          },
        })

        const slugAlreadyExists = await transaction.question.findFirst({
          where: {
            user_id: {
              equals: user_id,
            },
            AND: {
              slug: generateSlug(`${user?.username}/${data.title}`),
            },
          },
        })

        if (slugAlreadyExists) {
          throw new TitleSlugAlreadyExistsError()
        }

        const question = await transaction.question.update({
          data: {
            ...data,
            slug: generateSlug(`${user?.username}/${data.title}`),
          },
          where: {
            id: questionId,
          },
        })

        return question
      })

      return question
    } catch (error) {
      if (error instanceof TitleSlugAlreadyExistsError) {
        throw new TitleSlugAlreadyExistsError()
      }

      if (error instanceof NotFoundError) {
        throw new NotFoundError()
      }
    }
  }

  delete(questionId: string): Promise<{}> {
    throw new Error('Method not implemented.')
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await prisma.question.findFirst({
      where: {
        slug,
      },
    })

    return question
  }
}
