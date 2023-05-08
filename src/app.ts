import fastify from 'fastify'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)

app.get('/', (request, reply) => {
  console.log(request.method, request.url)
  reply.status(200).send('Request successful 🤪')
})
