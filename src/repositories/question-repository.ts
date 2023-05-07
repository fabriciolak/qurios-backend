import { Prisma, Question } from '@prisma/client'

interface QuestionExtendedProps
  extends Omit<
    Prisma.QuestionCreateInput,
    'id' | 'created_at' | 'updated_at' | 'published_at' | 'owner'
  > {
  owner_id: string
}

export interface QuestionRepository {
  create(data: QuestionExtendedProps): Promise<Question>
}
