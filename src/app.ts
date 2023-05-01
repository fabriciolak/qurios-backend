import fastify from 'fastify'

export const app = fastify()

app.get('/', (request, reply) => {
  console.log(request.method, request.url)
  reply.status(200).send('Request successful 🤪')
})
