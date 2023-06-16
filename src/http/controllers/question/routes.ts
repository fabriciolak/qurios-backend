import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { update } from './update'
import { deleteQuestion } from './delete'
import { getQuestion } from './get-question'
import { questionList } from './questions'
import { comment } from './comment'

export async function questionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/question', questionList)
  app.get('/question/:questionId', getQuestion)

  app.post('/question', create)
  app.post('/question/:questionId', comment)

  app.put('/question/:questionId', update)
  app.delete('/question', deleteQuestion)
}
