import crypto from 'node:crypto'
import { User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create({
    name,
    email,
    password_hash,
  }: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((data) => data.email === email)

    if (!user) {
      return null
    }

    return user
  }
}
