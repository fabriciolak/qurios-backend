import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function questionRoutes(app: FastifyInstance) {
  app.post('/question', create)
}
