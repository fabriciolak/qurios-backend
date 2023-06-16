import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const commentSchema = z.object({
  text: z.string(),
  user: z.string(),
})

const commentSchemaParams = z.object({
  questionId: z.string(),
})

export async function comment(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { text, user } = commentSchema.parse(request.body)
    const { questionId } = commentSchemaParams.parse(request.params)

    const questions = await prisma.comment.create({
      data: {
        text,
        question_id: questionId,
        user_id: user,
      },
    })

    return reply.status(200).send(questions)
  } catch (error) {
    console.error(error)
  }
}
