import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

type CreateAndAuthenticateUserType = {
  email?: string
  username?: string
}

export async function createAndAuthenticateTest(
  app: FastifyInstance,
  { email, username }: CreateAndAuthenticateUserType,
) {
  const user = await prisma.user.create({
    data: {
      email: email || 'testuser@test.com',
      username: username || 'testuser',
      name: 'Test User',
      password_hash: await hash('123456', 6),
    },
  })

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: email || 'testuser@test.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return {
    token,
    user,
  }
}
