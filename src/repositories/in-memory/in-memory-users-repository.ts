import crypto from 'node:crypto'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists'
import { UsernameAlreadyExistsError } from '@/use-cases/errors/username-already-exists'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create({
    name,
    username,
    email,
    password_hash,
  }: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password_hash,
      username,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async update(
    userId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return null
    }

    const emailAlreadyExists = await this.findByEmail(data.email as string)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const usernameAlreadyExists = await this.findByUsername(
      data.username as string,
    )

    if (usernameAlreadyExists) {
      throw new UsernameAlreadyExistsError()
    }

    const updatedUser = {
      ...this.users[userIndex],
      email:
        data.email !== undefined
          ? String(data.email)
          : this.users[userIndex].email,
      name:
        data.name !== undefined
          ? String(data.name)
          : this.users[userIndex].name,
      username:
        data.username !== undefined
          ? String(data.username)
          : this.users[userIndex].username,
    }

    this.users[userIndex] = updatedUser

    return updatedUser
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((data) => data.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((data) => data.username === username)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((data) => data.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
