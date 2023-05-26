import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateTest } from '@/utils/test/create-and-authenticate'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

describe('Delete Question (E2E)', () => {
  it('Should be delete a question by id', async () => {
    const { token } = await createAndAuthenticateTest(app, {})

    const questionCreated = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Question 1',
        content: 'content',
        anonymous: false,
      })

    const question = questionCreated.body

    await request(app.server)
      .delete('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question_id: question.id,
      })
  })

  it('User cannot be delete a question without a session', async () => {
    const token = 'invalid_token'

    const questionCreated = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Question 1',
        content: 'content',
        anonymous: false,
      })

    const question = questionCreated.body

    const response = await request(app.server)
      .delete('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question_id: question.id,
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
      }),
    )
  })

  it('User should be delete only own question', async () => {
    const { token } = await createAndAuthenticateTest(app, {
      email: 'testuser@gmail.com',
      username: 'testusergmail',
    })

    const { token: invalidToken } = await createAndAuthenticateTest(app, {
      email: 'testuser@ggmail.com',
      username: 'testuserggmail',
    })

    const questionCreated = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Question 1',
        content: 'content',
        anonymous: false,
      })

    const question = questionCreated.body

    const response = await request(app.server)
      .delete('/question')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({
        question_id: question.id,
      })

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Invalid Credentials Error',
      }),
    )
  })
})
