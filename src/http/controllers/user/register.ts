import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-create-user-use-case'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists'
import { UsernameAlreadyExistsError } from '@/use-cases/errors/username-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const userBodySchema = z.object({
    email: z.string().email(),
    name: z.string().max(24, { message: "Name can't be greater than 24" }),
    username: z
      .string()
      .min(1, { message: "Username can't be less than 1" })
      .max(16, { message: "Username can't be greater than 24" }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  })

  const { name, username, email, password } = userBodySchema.parse(request.body)

  try {
    const createUserUseCase = await makeRegisterUserUseCase()

    await createUserUseCase.execute({
      name,
      username,
      email,
      password,
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

  return reply.status(201).send()
}
