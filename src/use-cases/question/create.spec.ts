import { InMemoryQuestionRepository } from '@/repositories/in-memory/in-memory-question-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateQuestionUseCase } from './create'
import { RegisterUserUseCase } from '../user/register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let sutCreateQuestion: CreateQuestionUseCase
let questionRepository: InMemoryQuestionRepository

let sutCreateUser: RegisterUserUseCase
let usersRepository: InMemoryUsersRepository

describe('Question use case', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sutCreateQuestion = new CreateQuestionUseCase(questionRepository)

    usersRepository = new InMemoryUsersRepository()
    sutCreateUser = new RegisterUserUseCase(usersRepository)
  })

  it('Should be crate a question', async () => {
    const { user } = await sutCreateUser.execute({
      username: 'fabricio',
      name: 'Fabricio',
      email: 'fabricio@email.com',
      password: '123456',
    })

    const { question } = await sutCreateQuestion.execute({
      title: 'title',
      content: 'content',
      anonymous: false,
      slug: 'title',
      votes: 0,
      user_id: user.id,
    })

    expect(question.user_id).toEqual(user.id)
  })

  it('Should be crate a anonymous question', async () => {
    const { user } = await sutCreateUser.execute({
      username: 'fabricio',
      name: 'Fabricio',
      email: 'fabricio@email.com',
      password: '123456',
    })

    const { question } = await sutCreateQuestion.execute({
      title: 'title',
      content: 'content',
      anonymous: true,
      slug: 'title',
      votes: 0,
      user_id: user.id,
    })

    expect(question.user_id).toEqual('')
  })

  it('Should not be crate a question without content and title', async () => {
    const { user } = await sutCreateUser.execute({
      username: 'fabricio',
      name: 'Fabricio',
      email: 'fabricio@email.com',
      password: '123456',
    })

    await expect(
      sutCreateQuestion.execute({
        title: '',
        content: 'content',
        anonymous: true,
        slug: 'title',
        votes: 0,
        user_id: user.id,
      }),
    ).rejects.toThrowError('title are required')

    await expect(
      sutCreateQuestion.execute({
        title: 'title',
        content: '',
        anonymous: true,
        slug: 'title',
        votes: 0,
        user_id: user.id,
      }),
    ).rejects.toThrowError('content are required')
  })
})
