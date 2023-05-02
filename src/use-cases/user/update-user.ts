import { UsersRepository } from '@/repositories/users-repository'
// import { User } from '@prisma/client'

interface UpdateUserUseCaseRequest {
  id: string
  name: string
  email: string
  username: string
}

// interface UpdateUserUseCaseResponse {
//   user: User
// }

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id, email, name, username }: UpdateUserUseCaseRequest) {
    const user = await this.usersRepository.update({
      email,
      name,
      username,
    })

    console.log(user)
  }
}
