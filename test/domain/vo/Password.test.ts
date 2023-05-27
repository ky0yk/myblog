import { Password } from '../../../src/domain/vo/Password'

describe('Password', () => {
  it('should create password if it has at least 8 characters', () => {
    const password = new Password('goodpassword')
    expect(password.value).toBe('goodpassword')
  })

  it('should throw error if password lenght is less than 8 characters', () => {
    expect(() => new Password('short')).toThrowError('Invalid password format')
  })
})
