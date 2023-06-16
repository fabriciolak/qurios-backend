import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { update } from './update'
import { userProfile } from './user-profile'
import { me } from './me'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/profile/:userId', { onRequest: [verifyJwt] }, userProfile)
  app.get('/users/me', { onRequest: [verifyJwt] }, me)

  app.post('/users', register)
  app.put('/users', { onRequest: [verifyJwt] }, update)

  app.post('/sessions', authenticate)
}
