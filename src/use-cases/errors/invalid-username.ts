export class InvalidUsernameExistsError extends Error {
  constructor() {
    super('Invalid username. It should only contain letters and numbers.')
  }
}
