import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',

  async setup() {
    console.log('SETUP UP')

    return {
      async teardown() {
        console.log('SETUP DOWN')
      },
    }
  },
}
