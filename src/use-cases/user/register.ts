import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { EmailAlreadyExistsError } from '../errors/email-already-exists'
import { UsernameAlreadyExistsError } from '../errors/username-already-exists'

interface RegisterUserUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
    username,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const usernameAlreadyExists = await this.usersRepository.findByUsername(
      username,
    )

    if (usernameAlreadyExists) {
      throw new UsernameAlreadyExistsError()
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    const password_hash = await hash(password, 6)

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
