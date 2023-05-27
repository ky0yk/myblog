export class Content {
  private _value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('Content must not be empty')
    }
    this._value = value
  }

  get value(): string {
    return this._value
  }
}
