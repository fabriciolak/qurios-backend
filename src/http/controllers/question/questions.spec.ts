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

describe('Question list (E2E)', () => {
  it('Should be show a list of questions', async () => {
    const { token } = await createAndAuthenticateTest(app, {})

    await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Question title 1',
        content: 'content',
        anonymous: false,
      })

    await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Question title 2',
        content: 'content',
        anonymous: false,
      })

    const response = await request(app.server)
      .get('/question')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.body).toHaveLength(2)
    expect(response.body).toEqual([
      expect.objectContaining({
        id: expect.any(String),
      }),

      expect.objectContaining({
        id: expect.any(String),
      }),
    ])
  })
})
