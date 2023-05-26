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

describe('Update question (E2E)', () => {
  it('Should be update a question', async () => {
    const { token } = await createAndAuthenticateTest(app, {})

    await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'User Test Question',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })
      .expect(201)
  })

  it('User cannot create a question without a token session', async () => {
    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer token`)
      .send({
        title: 'User Test Question',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
      }),
    )
  })

  it('User cannot edit question from another users', async () => {
    const { token: userToken3 } = await createAndAuthenticateTest(app, {
      email: 'testuser3@email.com',
      username: 'testuser3',
    })
    const { token: userToken4 } = await createAndAuthenticateTest(app, {
      email: 'testuser4@email.com',
      username: 'testuser4',
    })

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${userToken3}`)
      .send({
        title: 'User Test 3 Question',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    const updated = await request(app.server)
      .put(`/question/${response.body.id}`)
      .set('Authorization', `Bearer ${userToken4}`)
      .send({
        title: 'User Test 4 Question',
      })

    expect(updated.statusCode).toEqual(401)
    expect(updated.body).toEqual(
      expect.objectContaining({ message: 'Invalid Credentials Error' }),
    )
  })

  it('User cannot be create a question with same title', async () => {
    const { token } = await createAndAuthenticateTest(app, {
      email: 'testuser5@email.com',
      username: 'testuser5',
    })

    await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'User Test 5 Question',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    const response = await request(app.server)
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'User Test 5 Question',
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

  it('User cannot be update a question with id (uuid) invalid', async () => {
    const { token } = await createAndAuthenticateTest(app, {
      email: 'testuser6@email.com',
      username: 'testuser6',
    })

    const invalidUuid = '83051d74-034f-4fe4-be39-179b4c62b02dC'

    const response = await request(app.server)
      .put(`/question/${invalidUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'User Test 6 Question',
        content: 'Consectetur adipiscing elit',
        anonymous: false,
      })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toEqual({
      message: {
        _errors: expect.any(Array),
        questionId: expect.objectContaining({
          _errors: expect.arrayContaining([
            'Invalid question id. must be UUID',
          ]),
        }),
      },
    })
  })
})
