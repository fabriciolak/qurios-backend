import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/user/create'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
}
