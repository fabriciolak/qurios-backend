import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { UsernameAlreadyExistsError } from '@/use-cases/errors/username-already-exists'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async update(userId: string, data: Prisma.UserUpdateInput) {
    const usernameAlreadyExists = await prisma.user.findUniqueOrThrow({
      where: {
        username: data.username as string,
      },
    })

    if (usernameAlreadyExists) {
      throw new UsernameAlreadyExistsError()
    }

    const user = await prisma.user.update({
      data,
      where: {
        id: userId,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    return user
  }
}
