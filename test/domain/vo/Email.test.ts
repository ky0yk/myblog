import { Email } from '../../../src/domain/vo/Email'

describe('Email', () => {
  it("should create email if it's in correct format", () => {
    const email = new Email('valid.email@example.com')
    expect(email.value).toBe('valid.email@example.com')
  })

  it('should throw error if email is not in correct format', () => {
    expect(() => new Email('notvalidemail')).toThrowError(
      'Invalid email format'
    )
  })
})
