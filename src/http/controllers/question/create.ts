import { prisma } from '@/lib/prisma'
import { TitleSlugAlreadyExistsError } from '@/use-cases/errors/title-slug-already-exisits'
import { makeCreateQuestionUseCase } from '@/use-cases/factories/make-create-question-use-case'
import { generateSlug } from '@/utils/generate-slug'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createQuestionBodySchema = z.object({
    title: z.string().min(6, {
      message: 'The title should be a minimum of 6 characters.',
    }),
    content: z.string().min(1, {
      message: 'The content should be a minimum of 1 characters.',
    }),
    anonymous: z.boolean().default(false),
  })

  const questionRepository = await makeCreateQuestionUseCase()

  try {
    const { title, content, anonymous } = createQuestionBodySchema.parse(
      request.body,
    )

    const userProfile = await prisma.user.findUnique({
      where: {
        id: request.user.sub,
      },
      select: {
        username: true,
        questions: true,
      },
    })

    const generatedSlugUrl = `${userProfile?.username}/${generateSlug(title)}`

    const slugAlreadyExists = userProfile?.questions.find((question) => {
      return question.slug === generatedSlugUrl
    })

    if (slugAlreadyExists) {
      throw new TitleSlugAlreadyExistsError()
    }

    const { question } = await questionRepository.execute({
      title,
      content,
      anonymous,
      slug: generatedSlugUrl,
      user_id: request.user.sub,
      votes: 0,
    })

    return reply.status(201).send(question)
  } catch (error) {
    if (error instanceof TitleSlugAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: `Validation error`,
      })
    }

    if (error instanceof TitleSlugAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }
}
