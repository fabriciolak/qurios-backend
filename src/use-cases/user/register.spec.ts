import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUserUseCase } from './register'
import { compare } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('Create user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  it('Should be possible create a user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
    expect(user).toEqual(
      expect.objectContaining({
        username: 'johndoe',
      }),
    )
  })

  it('Should not be possible create a user with a existing username', async () => {
    await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Jane Doe',
        username: 'johndoe',
        email: 'janedoe@email.com',
        password: '123456',
      }),
    ).rejects.toThrowError('Username with same username already exists')
  })

  it('Should not be possible create a user with a existing email', async () => {
    await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'johndoe@email.com',
        password: '123456',
      }),
    ).rejects.toThrowError('Email already exists.')
  })

  it('Should not be possible to create a user with a password that is less than 6 characters.', async () => {
    await expect(() =>
      sut.execute({
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'johndoe@email.com',
        password: '12345',
      }),
    ).rejects.toThrowError('Password must be at least 6 characters')
  })
})
