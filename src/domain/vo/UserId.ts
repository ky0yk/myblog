export class UserId {
  private _value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('UserId must not be empty')
    }
    this._value = value
  }

  get value(): string {
    return this._value
  }
}
