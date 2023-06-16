import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function me(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: request.user.sub,
      },
    })

    if (user && 'password_hash' in user) {
      const { password_hash, ...userWithoutPassword } = user
      return reply.status(200).send(userWithoutPassword)
    }
  } catch (error) {
    console.log(error)
  }
}
