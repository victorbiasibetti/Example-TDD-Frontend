export class EmailInUseError extends Error {
  constructor () {
    super('E-mail já está cadastrado')
    this.name = 'EmailInUseError'
  }
}
