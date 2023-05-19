import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

describe('Authenticate user (E2E)', () => {
  it('Should be authenticate a user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@does.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@does.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })
})
