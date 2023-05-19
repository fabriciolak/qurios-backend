import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserUseCase } from '../user/update-user'

export async function fetchUpdateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const updateUseCase = new UpdateUserUseCase(usersRepository)

  return updateUseCase
}
