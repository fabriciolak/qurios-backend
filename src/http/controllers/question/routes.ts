import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { update } from './update'
import { deleteQuestion } from './delete'

export async function questionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/question', create)
  app.put('/question/:questionId', update)
  app.delete('/question', deleteQuestion)
}
