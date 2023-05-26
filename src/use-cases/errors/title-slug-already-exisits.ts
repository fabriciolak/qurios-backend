export class TitleSlugAlreadyExistsError extends Error {
  constructor() {
    super(`A publication with that title already exists. try another title`)
  }
}
