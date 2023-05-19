import { AuthenticateUseCase } from '../user/authenticate'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const sut = new AuthenticateUseCase(usersRepository)

  return sut
}
