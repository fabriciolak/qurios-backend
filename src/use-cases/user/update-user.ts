import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { EmailAlreadyExistsError } from '../errors/email-already-exists'
import { UsernameAlreadyExistsError } from '../errors/username-already-exists'

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
    userId: string,
    data: UpdateUserUseCaseRequest,
  ): Promise<UpdateUserUseCaseResponse> {
    const emailExists = await this.usersRepository.findByEmail(data.email ?? '')

    const usernameExists = await this.usersRepository.findByUsername(
      data.username ?? '',
    )

    if (emailExists) {
      throw new EmailAlreadyExistsError()
    }

    if (usernameExists) {
      throw new UsernameAlreadyExistsError()
    }

    const user = await this.usersRepository.update(userId, data)

    if (!user) {
      throw new Error('Resource not found')
    }

    return {
      user,
    }
  }
}
