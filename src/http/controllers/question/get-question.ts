import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getQuestion(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { questionId } = request.params as { questionId: string }

  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
    },
  })

  return reply.status(200).send(question)
}
