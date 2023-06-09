import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  update(userId: string, data: Prisma.UserUpdateInput): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
}
