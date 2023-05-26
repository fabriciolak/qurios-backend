import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { update } from './update'
import { deleteQuestion } from './delete'
import { questionList } from './questions'

export async function questionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/question', questionList)

  app.post('/question', create)
  app.put('/question/:questionId', update)
  app.delete('/question', deleteQuestion)
}
