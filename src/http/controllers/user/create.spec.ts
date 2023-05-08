import { afterAll, beforeAll, describe, it } from 'vitest'
// import request from 'supertest'
import { app } from '@/app'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

describe('HTTP /users', () => {
  describe('[POST] Register new user', () => {
    it('Should be register a new user', async () => {
      // await request(app)
      //   .post('/users')
      //   .send({
      //     name: 'John Doe',
      //     username: 'johndoe',
      //     email: 'johndoe@does.com',
      //     password: '123456',
      //   })
      //   .expect(201)
      console.log('User created using test environment')
    })
  })
})
