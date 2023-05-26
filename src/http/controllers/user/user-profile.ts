import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function userProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userProfileParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = userProfileParamsSchema.parse(request.params)

    const usersRepository = new PrismaUsersRepository()

    const user = await usersRepository.findById(userId)

    if (user && 'password_hash' in user) {
      const { password_hash, ...userWithoutPassword } = user
      return reply.status(200).send(userWithoutPassword)
    }
  } catch (error) {
    console.log(error)
  }
}
