import { afterAll, beforeAll, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

describe('Update user (E2E))', () => {
  it('Should be update a user', async () => {
    // register a new user

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@does.com',
        password: '123456',
      })
      .expect(201)

    // create a session to the user and get token

    const sessionResponse = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@does.com', password: '123456' })
      .expect(200)

    const { token } = sessionResponse.body

    await request(app.server)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'newjohndoe@does.com' })
      .expect(200)
  })

  it('Should not be update a user with same email', async () => {
    // register a new user

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe2',
        email: 'johndoe2@does.com',
        password: '123456',
      })
      .expect(201)

    // create a session to the user and get token

    const sessionResponse = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe2@does.com', password: '123456' })
      .expect(200)

    const { token } = sessionResponse.body

    await request(app.server)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'johndoe2@does.com' })
      .expect(409)
  })
})
