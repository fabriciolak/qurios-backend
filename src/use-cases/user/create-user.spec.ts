import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { compare } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)
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
    ).rejects.toThrowError('Username with same name already exists')
  })
})
