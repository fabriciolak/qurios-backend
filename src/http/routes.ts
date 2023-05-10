import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/user/create'
import { authenticate } from './controllers/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)
}
