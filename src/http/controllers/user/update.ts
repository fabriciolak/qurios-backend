import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists'
import { UsernameAlreadyExistsError } from '@/use-cases/errors/username-already-exists'
import { fetchUpdateUserUseCase } from '@/use-cases/factories/fetch-update-user'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    username: z.string().optional(),
  })

  const { email, name, username } = updateBodySchema.parse(request.body)

  try {
    const updateUseCase = await fetchUpdateUserUseCase()

    await updateUseCase.execute(request.user.sub, {
      email,
      name,
      username,
    })
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    if (error instanceof UsernameAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }

  return reply.status(200).send()
}
