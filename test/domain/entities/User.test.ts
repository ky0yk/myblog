import { User } from '../../../src/domain/entities/User'
import { Email } from '../../../src/domain/vo/Email'
import { Name } from '../../../src/domain/vo/Name'
import { Password } from '../../../src/domain/vo/Password'
import { UserId } from '../../../src/domain/vo/UserId'

describe('User', () => {
  it('should create a user successfully', () => {
    const user = new User(
      new UserId('1'),
      new Name('Test User'),
      new Email('test@example.com'),
      new Password('password')
    )

    expect(user.id.value).toEqual('1')
    expect(user.name.value).toEqual('Test User')
    expect(user.email.value).toEqual('test@example.com')
    expect(user.password.value).toEqual('password')
  })
})
