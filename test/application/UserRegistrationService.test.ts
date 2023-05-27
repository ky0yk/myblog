import { User, UserCreateDto } from '../../src/domain/entities/User'
import { UserRegistrationService } from "../../src/application/UserRegistrationService";
import { Email } from "../../src/domain/vo/Email";
import { Name } from "../../src/domain/vo/Name";
import { Password } from "../../src/domain/vo/Password";
import { UserRepository } from "../../src/infrastructure/repositories/UserRepository"
import { v4 as uuidv4 } from 'uuid';
import { UserId } from '../../src/domain/vo/UserId';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

describe("UserRegistrationService", () => {
    let userRepository: UserRepository;
    let userRegistrationService: UserRegistrationService;

    const userDto: UserCreateDto = {
        name: new Name('Test Name'),
        email: new Email('test@example.com'),
        password: new Password('password')
    }

    const userEntity = new User(
        new UserId(uuidv4()),
        new Name('Test Name'),
        new Email('test@example.com'),
        new Password('password')
    )

    beforeEach(() => {
        prisma = new PrismaClient();
        userRepository = new UserRepository(prisma); 
        userRegistrationService = new UserRegistrationService(userRepository);
      });
    
      afterEach(() => {
        prisma.$disconnect();
      });

    it('should create a user when email is not in user', async() => {
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
        jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity);

        const result = await userRegistrationService.register(userDto);

        expect(result).toEqual(userEntity);
    });

    it('should throw error when email is already in user', async () => {
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(userEntity);

        await expect(userRegistrationService.register(userDto)).rejects.toThrow('Email already in use.');
    })
})
