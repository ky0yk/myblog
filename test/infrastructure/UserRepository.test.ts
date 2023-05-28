const mockedFindUnique = jest.fn();
const mockedUpsert = jest.fn();
const mockedDelete = jest.fn();


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        user: {
          findUnique: mockedFindUnique,
          upsert: mockedUpsert,
          delete: mockedDelete,
        },
      }
    }),
  }
})

jest.mock('../../src/utils/passwordHasher', () => ({
  hashPassword: jest.fn(),
}));

import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../src/infrastructure/repositories/UserRepository'
import { UserId } from '../../src/domain/vo/UserId'
import { Email } from '../../src/domain/vo/Email'
import { Name } from '../../src/domain/vo/Name'
import { Password } from '../../src/domain/vo/Password'
import { User } from '../../src/domain/entities/User'
import { hashPassword } from '../../src/utils/passwordHasher';

let userRepository: UserRepository
const prisma = new PrismaClient()

const testUserData = {
  id: new UserId('someId'),
  name: new Name('Test Name'),
  email: new Email('test@example.com'),
  password: new Password('password'),
}
const userEntity = new User(
  testUserData.id,
  testUserData.name,
  testUserData.email,
  testUserData.password
)

const mockUser = {
  id: testUserData.id.value,
  name: testUserData.name.value,
  email: testUserData.email.value,
  password: testUserData.password.value,
}

beforeEach(() => {
  userRepository = new UserRepository(prisma)
})

describe('UserRepository', () => {
  describe('find', () => {
    it('should return the expected user when user exists', async () => {
      mockedFindUnique.mockResolvedValue(mockUser)
      const result = await userRepository.find(testUserData.id)
      expect(result).toEqual(userEntity)
    })

    it('should return null when user does not exist', async () => {
      mockedFindUnique.mockResolvedValue(null)
      const result = await userRepository.find(testUserData.id)
      expect(result).toBeNull()
    })

    it('should throw error when findUnique throws error', async () => {
      mockedFindUnique.mockRejectedValue(new Error('Test error'))
      await expect(userRepository.find(testUserData.id)).rejects.toThrow(
        'Test error'
      )
    })
  })

  describe('findByEmail', () => {
    it('should return the expected user when user exists', async () => {
      mockedFindUnique.mockResolvedValue(mockUser)
      const result = await userRepository.findByEmail(testUserData.email)
      expect(result).toEqual(userEntity)
    })

    it('should return null when user does not exist', async () => {
      mockedFindUnique.mockResolvedValue(null)
      const result = await userRepository.findByEmail(testUserData.email)
      expect(result).toBeNull()
    })

    it('should throw error when findUnique throws error', async () => {
      mockedFindUnique.mockRejectedValue(new Error('Test error'))
      await expect(
        userRepository.findByEmail(testUserData.email)
      ).rejects.toThrow('Test error')
    })
  })

  describe('save', () => {
    it('should correctly upsert a user', async () => {
      const hashedPassword = "$2b$10$GAgBnie6a4gfV1uq8aX7DeXInn8pay2LKs/fJKBu7s7rFOtyCHPV.";

      mockedUpsert.mockResolvedValue({...mockUser, password: hashedPassword});
      (hashPassword as jest.Mock).mockImplementation(() => Promise.resolve(hashedPassword));

      const expectedUserEntity = new User(
        testUserData.id,
        testUserData.name,
        testUserData.email,
        new Password(hashedPassword)
      )

      const savedUser = await userRepository.save(userEntity);

      expect(mockedUpsert).toHaveBeenCalledWith({
        where: { id: testUserData.id.value },
        update: { 
          name: testUserData.name.value, 
          email: testUserData.email.value, 
          password: hashedPassword
        },
        create: { 
          id: testUserData.id.value, 
          name: testUserData.name.value, 
          email: testUserData.email.value, 
          password: hashedPassword
        },
      });

      expect(savedUser).toEqual(expectedUserEntity);
    });

    it('should throw error when upsert throws error', async () => {
      mockedUpsert.mockRejectedValue(new Error('Test error'));
      await expect(userRepository.save(userEntity)).rejects.toThrow(
        'Test error'
      );
    });
  });

  describe('delete', () => {
    it('should correctly delete a user', async () => {
      mockedDelete.mockResolvedValue(mockUser);
      await userRepository.delete(testUserData.id);
    
      expect(mockedDelete).toHaveBeenCalledWith({ where: { id: testUserData.id.value } });
    });
    
    it('should throw error when delete throws error', async () => {
      mockedDelete.mockRejectedValue(new Error('Test error'));
      await expect(userRepository.delete(testUserData.id)).rejects.toThrow(
        'Test error'
      );
    });
  });
});
