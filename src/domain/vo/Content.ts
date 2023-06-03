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

  shortVersion(maxLength = 100): string {
    return this._value.length <= maxLength
      ? this._value
      : this._value.slice(0, maxLength) + '...';
  }
}
