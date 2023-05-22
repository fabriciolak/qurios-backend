import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('User authenticate', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      email: 'johndoe@does.com',
      name: 'John Doe',
      username: 'johndoe',
      password_hash: await hash('123456', 6),
    })
  })

  it('Should be able to authenticate', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@does.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'wrongemail@does.com',
        password: '123456',
      }),
    ).rejects.toThrowError('Invalid Credentials Error')
  })

  it('Should not be able to authenticate with wrong password', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@does.com',
        password: '123456789101112',
      }),
    ).rejects.toThrowError('Invalid Credentials Error')
  })
})
