export class UsernameAlreadyExistsError extends Error {
  constructor() {
    super('Username with same username already exists')
  }
}
