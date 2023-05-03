import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
// import { UsernameAlreadyExistsError } from '../errors/username-already-exists'
// import { EmailAlreadyExistsError } from '../errors/email-already-exists'

interface UpdateUserUseCaseRequest {
  name?: string
  email?: string
  username?: string
}

interface UpdateUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    id: string,
    data: UpdateUserUseCaseRequest,
  ): Promise<UpdateUserUseCaseResponse | null> {
    if (!id) {
      return null
    }

    const user = await this.usersRepository.update(id, data)

    if (!user) {
      throw new Error('Resource not found')
    }

    return {
      user,
    }
  }
}
