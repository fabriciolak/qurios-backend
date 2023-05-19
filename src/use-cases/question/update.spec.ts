import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateQuestionUseCase } from './update'
import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { CreateQuestionUseCase } from './create'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUserUseCase } from '../user/register'
import { hash } from 'bcryptjs'

let questionsRepository: InMemoryQuestionRepository
let sut: UpdateQuestionUseCase
let createQuestion: CreateQuestionUseCase

let usersRepository: InMemoryUsersRepository
let userCreate: RegisterUserUseCase

describe('Update question use case', () => {
  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new UpdateQuestionUseCase(questionsRepository)
    createQuestion = new CreateQuestionUseCase(questionsRepository)

    usersRepository = new InMemoryUsersRepository()
    userCreate = new RegisterUserUseCase(usersRepository)
  })

  it('Should be update a question', async () => {
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

    const response = await sut.execute({
      questionId: question.id,
      data: {
        title: 'Updated',
        updated_at: new Date('2023-05-19T19:59:01.250Z'),
      },
    })

    expect(response.question).toEqual(
      expect.objectContaining({
        title: 'Updated',
        content: "John Doe's question content",
        updated_at: new Date('2023-05-19T19:59:01.250Z'),
      }),
    )
  })
})
