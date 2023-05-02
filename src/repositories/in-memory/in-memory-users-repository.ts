import crypto from 'node:crypto'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

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

  async update(userId: Prisma.UserUpdateInput): Promise<User | null> {
    const userIndex = this.users.findIndex((data) => data.id === userId)

    console.log(userIndex)

    return null
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
}
