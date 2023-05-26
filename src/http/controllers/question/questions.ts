import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function questionList(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const questions = await prisma.question.findMany({
    take: 20,
    // skip: (1 - 1) * 20,
    orderBy: [
      {
        created_at: 'asc',
      },
    ],
  })

  return reply.status(200).send(questions)
}
