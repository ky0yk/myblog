export class Title {
  private _value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('Title must not be empty')
    }
    this._value = value
  }

  get value(): string {
    return this._value
  }
}
