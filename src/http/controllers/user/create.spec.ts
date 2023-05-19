import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

describe('Create user (E2E))', () => {
  it('Should be register a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@does.com',
        password: '123456',
      })
      .expect(201)
  })

  it('Should not be able to register a new user with an email that is already registered', async () => {
    const user = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@does.com',
      password: '123456',
    }

    await request(app.server).post('/users').send(user)

    const response = await request(app.server).post('/users').send(user)

    expect(response.status).toBe(409)
    expect(response.body.message).toBe('Email already exists.')
  })
})
