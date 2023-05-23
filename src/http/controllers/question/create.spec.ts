import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

describe('Create question (E2E)', () => {
  it('Should be create a question', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe2@does.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe2@does.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Lorem ipsum dolor sit amet',
        content: 'consectetur adipiscing elit. Duis nec.',
        anonymous: false,
      })

    expect(response.statusCode).toEqual(201)
  })

  it('Should not be create a question with same title', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe2@does.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe2@does.com',
      password: '123456',
    })

    const { token } = authResponse.body

    await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Aenean consectetur fringilla tincidunt.',
        content: 'consectetur adipiscing elit. Duis nec.',
        anonymous: false,
      })

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Aenean consectetur fringilla tincidunt.',
        content: 'consectetur adipiscing elit. Duis nec.',
        anonymous: false,
      })

    expect(response.statusCode).toEqual(409)
  })

  it('Should not be create a question without title', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe2@does.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe2@does.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'consectetur adipiscing elit. Duis nec.',
        anonymous: false,
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Validation error',
      }),
    )
  })
})
