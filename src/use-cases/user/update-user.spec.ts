import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateUserUseCase } from './update-user'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
import { EmailAlreadyExistsError } from '../errors/email-already-exists'
import { UsernameAlreadyExistsError } from '../errors/username-already-exists'

let usersRepository: InMemoryUsersRepository
let sutUserUpdate: UpdateUserUseCase
let sutUserCreate: CreateUserUseCase
let sutUser: User

describe('Update user use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sutUserUpdate = new UpdateUserUseCase(usersRepository)
    sutUserCreate = new CreateUserUseCase(usersRepository)

    const { user } = await sutUserCreate.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@does.com',
      password: '123456',
    })

    sutUser = user

    const isPasswordHashed = await compare('123456', user.password_hash)
    expect(isPasswordHashed).toBe(true)

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'johndoe@does.com',
      }),
    )
  })

  it('Should be possible for any user to change their email', async () => {
    const updatedUser = await sutUserUpdate.execute(sutUser.id, {
      email: 'changed-email@does.com',
    })

    expect(updatedUser?.user).toEqual(
      expect.objectContaining({
        email: 'changed-email@does.com',
      }),
    )

    await expect(
      sutUserUpdate.execute(sutUser.id, {
        email: 'changed-email@does.com',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be possible for any user to change their username', async () => {
    const updatedUser = await sutUserUpdate.execute(sutUser.id, {
      username: 'janedoe',
    })

    expect(updatedUser?.user).toEqual(
      expect.objectContaining({
        username: 'janedoe',
      }),
    )

    await expect(
      sutUserUpdate.execute(sutUser.id, {
        username: 'janedoe',
      }),
    ).rejects.toBeInstanceOf(UsernameAlreadyExistsError)
  })
})
