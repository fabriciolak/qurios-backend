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

describe('Profile user (E2E))', () => {
  it('Should be get user profile', async () => {
    const { token, user } = await createAndAuthenticateTest(app, {})

    const response = await request(app.server)
      .get(`/users/profile/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(user.id),
      }),
    )
  })
})
