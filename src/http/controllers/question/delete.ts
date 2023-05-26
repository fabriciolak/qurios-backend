import { prisma } from '@/lib/prisma'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { deleteQuestionUseCase } from '@/use-cases/factories/delete-question-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

export async function deleteQuestion(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteQuestionBodySchema = z.object({
    question_id: z.string().uuid(),
  })

  try {
    const { question_id } = deleteQuestionBodySchema.parse(request.body)

    const userHavePermission = await prisma.question.findFirst({
      where: {
        id: question_id,
        user_id: request.user.sub,
      },
    })

    if (!userHavePermission) {
      throw new InvalidCredentialsError()
    }

    const questionRepository = await deleteQuestionUseCase()

    await questionRepository.execute({ question_id })

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        message: error.message,
      })
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: error.format(),
      })
    }
  }
}
