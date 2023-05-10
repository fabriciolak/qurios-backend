import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'

export const app = fastify()

app.register(appRoutes)

app.get('/', (request, reply) => {
  console.log(request.method, request.url)
  reply.status(200).send('Request successful 🤪')
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    console.log(error)
    return reply.status(400).send({
      statusCode: error.statusCode,
      message: 'Validation error',
      issues: error.issues,
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
