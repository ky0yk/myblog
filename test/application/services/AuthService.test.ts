import { PrismaClient } from '@prisma/client'
import { AuthService } from '../../../src/application/services/AuthService'
import { UserRepository } from '../../../src/infrastructure/repositories/UserRepository'
import { User } from '../../../src/domain/entities/User'
import { UserId } from '../../../src/domain/vo/UserId'
import { Name } from '../../../src/domain/vo/Name'
import { Email } from '../../../src/domain/vo/Email'
import { Password } from '../../../src/domain/vo/Password'
import { comparePassword } from '../../../src/utils/passwordHasher'

jest.mock('../../../src/infrastructure/repositories/UserRepository')

jest.mock('../../../src/utils/passwordHasher', () => ({
  comparePassword: jest.fn(),
}))

let prisma: PrismaClient

describe('AuthSerivice', () => {
  let authService: AuthService
  let userRepository: UserRepository

  beforeEach(() => {
    prisma = new PrismaClient()
    userRepository = new UserRepository(prisma)
    authService = new AuthService(userRepository)
  })

  it('returns a token if login if successful', async () => {
    const user = new User(
      new UserId('userId'),
      new Name('John Doe'),
      new Email('john.doe@example.com'),
      new Password('hashedpassword')
    )

    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(user)
    ;(comparePassword as jest.Mock).mockResolvedValue(true)

    const token = await authService.login(
      new Email('john.doe@example.com'),
      new Password('hashedpassword')
    )

    expect(typeof token).toBe('string')
  })

  it('retunrs null if login fails', async () => {
    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)

    const token = await authService.login(
      new Email('john.doe@example.com'),
      new Password('wronghashedpassword')
    )

    expect(token).toBeNull()
  })

  it('throws error if JWT_SECRET_KEY is not defined', async () => {
    delete process.env.JWT_SECRET_KEY // Delete JWT_SECRET_KEY from environment variables to simulate it not being set

    const user = new User(
      new UserId('userId'),
      new Name('John Doe'),
      new Email('john.doe@example.com'),
      new Password('hashedpassword')
    )

    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(user) // Mock the return value of findByEmail

    await expect(
      authService.login(
        new Email('john.doe@example.com'),
        new Password('hashedpassword')
      )
    ).rejects.toThrow('JWT_SECRET_KEY is not defined.') // Assert that an error is thrown
  })
})
