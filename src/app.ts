import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import { userRoutes } from './http/controllers/user/routes'
import { questionRoutes } from './http/controllers/question/routes'
import { ZodError } from 'zod'

export const app = fastify()

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
})

app.register(userRoutes)
app.register(questionRoutes)

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
