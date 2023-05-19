import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserUseCase } from '../user/register'

export async function makeRegisterUserUseCase() {
  const userRepository = new PrismaUsersRepository()
  const userUseCase = new RegisterUserUseCase(userRepository)

  return userUseCase
}
