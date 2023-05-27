import { User } from '../entities/User'
import { IUserRepository } from '../repositories/IUserRepository'
import { Email } from '../vo/Email'
import { Password } from '../vo/Password'

export class AuthenticationService {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async authenticate(email: Email, password: Password): Promise<User> {
    const user = await this.userRepository.findByEmail(email)
    if (user == null) {
      throw new Error('User not found')
    }

    if (!user.verifyPassword(password)) {
      throw new Error('Invalid password')
    }

    return user
  }
}
