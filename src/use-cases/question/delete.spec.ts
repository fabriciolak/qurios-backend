import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { CreateQuestionUseCase } from './create'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { CreateUserUseCase } from '../user/create-user'
import { hash } from 'bcryptjs'
import { DeleteQuestionUseCase } from './delete'

let questionsRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase
let createQuestion: CreateQuestionUseCase

let usersRepository: InMemoryUsersRepository
let userCreate: CreateUserUseCase

describe('Delete question use case', () => {
  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
    createQuestion = new CreateQuestionUseCase(questionsRepository)

    usersRepository = new InMemoryUsersRepository()
    userCreate = new CreateUserUseCase(usersRepository)
  })

  it('Should be delete a question', async () => {
    const { user } = await userCreate.execute({
      name: 'John Doe',
      email: 'johndoe@does.com',
      username: 'johndoe',
      password: await hash('123456', 6),
    })

    const { question } = await createQuestion.execute({
      title: "John Doe's question",
      content: "John Doe's question content",
      anonymous: false,
      owner_id: user.id,
      slug: 'john-does-question',
      votes: 0,
    })

    const questionId = question.id
    const response = await sut.execute({ questionId })

    expect(response).toEqual({})
  })
})
