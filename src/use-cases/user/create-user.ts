import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { EmailAlreadyExistsError } from '../errors/email-already-exists'

interface CreateUserUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
    username,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const usernameAlreadyExists = await this.usersRepository.findByUsername(
      username,
    )

    if (usernameAlreadyExists) {
      throw new Error('Username with same name already exists')
    }

    const user = await this.usersRepository.create({
      name,
      username,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
