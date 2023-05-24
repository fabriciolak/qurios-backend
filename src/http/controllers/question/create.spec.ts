import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateTest } from '@/utils/test/create-and-authenticate'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

describe('Create question (E2E)', () => {
  it('Should be create a question', async () => {
    const { token } = await createAndAuthenticateTest(app, {})

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Lorem ipsum dolor sit amet',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )
  })

  it('User cannot create a question with a title already used', async () => {
    const { token } = await createAndAuthenticateTest(app, {
      email: 'testuser2@test.com',
      username: 'testuser2',
    })

    await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Lorem ipsum dolor sit amet',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Lorem ipsum dolor sit amet',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toEqual(
      expect.objectContaining({
        message:
          'A publication with that title already exists. try another title',
      }),
    )
  })

  it('Error on create a question without title or content', async () => {
    const { token } = await createAndAuthenticateTest(app, {
      email: 'testuser3@test.com',
      username: 'testuser3',
    })

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Validation error',
      }),
    )
  })
})
