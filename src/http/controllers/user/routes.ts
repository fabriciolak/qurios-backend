import { FastifyInstance } from 'fastify'
import { createUser } from './create'
import { authenticate } from './authenticate'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)
}
