import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { NotFoundError } from '@/use-cases/errors/not-found-error'
import { TitleSlugAlreadyExistsError } from '@/use-cases/errors/title-slug-already-exisits'
import { makeUpdateQuestionUseCase } from '@/use-cases/factories/make-update-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateQuestionParamsSchema = z.object({
    questionId: z.string().uuid({
      message: 'Invalid question id. must be UUID',
    }),
  })

  const updateQuestionBodySchema = z.object({
    title: z
      .string()
      .min(1, {
        message: 'The title should be a minimum of 1 characters.',
      })
      .optional(),
    content: z
      .string()
      .min(1, {
        message: 'The content should be a minimum of 1 characters.',
      })
      .optional(),
    anonymous: z.boolean().default(false),
  })

  try {
    const questionRepository = await makeUpdateQuestionUseCase()

    const { title, content, anonymous } = updateQuestionBodySchema.parse(
      request.body,
    )
    const { questionId } = updateQuestionParamsSchema.parse(request.params)

    const { question } = await questionRepository.execute(questionId, {
      title,
      content,
      anonymous,
      slug: '',
      updated_at: new Date(),
      user_id: request.user.sub,
    })

    return reply.status(200).send(question)
  } catch (error) {
    if (error instanceof TitleSlugAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    if (error instanceof ZodError) {
      return reply.status(409).send({
        message: error.format(),
      })
    }

    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        message: error.message,
      })
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    return reply.status(500).send({
      message: 'Internal Server Error',
    })
  }
}
