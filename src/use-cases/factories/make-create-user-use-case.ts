import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateUserUseCase } from '../user/create-user'

export async function makeCreateUserUseCase() {
  const userRepository = new PrismaUsersRepository()
  const userUseCase = new CreateUserUseCase(userRepository)

  return userUseCase
}
