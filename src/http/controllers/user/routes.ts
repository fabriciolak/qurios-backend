import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { update } from './update'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.put('/users', { onRequest: [verifyJwt] }, update)

  app.post('/sessions', authenticate)
}
