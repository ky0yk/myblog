const mockedFindUnique = jest.fn();
const mockedUpsert = jest.fn();
const mockedDelete = jest.fn();

jest.mock("@prisma/client", () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            return {
                user: {
                    findUnique: mockedFindUnique,
                    upsert: mockedUpsert,
                    delete: mockedDelete,
                },
            };
        }),
    };
});

import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../../src/infrastructure/repositories/UserRepository";
import { UserId } from "../../src/domain/vo/UserId";
import { Email } from "../../src/domain/vo/Email";
import { Name } from "../../src/domain/vo/Name";
import { Password } from "../../src/domain/vo/Password";
import { User } from "../../src/domain/entities/User";

let userRepository: UserRepository;
const prisma = new PrismaClient();

const testUserData = {
  id: new UserId("someId"),
  name: new Name("Test Name"),
  email: new Email("test@example.com"),
  password: new Password("password"),
};
const userEntity: User = new User(testUserData.id, testUserData.name, testUserData.email, testUserData.password);

const mockUser = {
  id: testUserData.id.value,
  name: testUserData.name.value,
  email: testUserData.email.value,
  password: testUserData.password.value,
};

beforeEach(() => {
  userRepository = new UserRepository(prisma);
});

describe("UserRepository", () => {
    describe("find", () => {
        beforeEach(() => {
            mockedFindUnique.mockReset();
        });

        it("should return the expected user when user exists", async () => {
            mockedFindUnique.mockResolvedValue(mockUser);
            const result = await userRepository.find(testUserData.id);
            expect(result).toEqual(userEntity);
        });

        it("should return null when user does not exist", async () => {
            mockedFindUnique.mockResolvedValue(null);
            const result = await userRepository.find(testUserData.id);
            expect(result).toBeNull();
        });

        it("should throw error when findUnique throws error", async () => {
            mockedFindUnique.mockRejectedValue(new Error("Test error"));
            await expect(userRepository.find(testUserData.id)).rejects.toThrow("Test error");
        });
    });

    describe("findByEmail", () => {
        beforeEach(() => {
            mockedFindUnique.mockReset();
        });

        it("should return the expected user when user exists", async () => {
            mockedFindUnique.mockResolvedValue(mockUser);
            const result = await userRepository.findByEmail(testUserData.email);
            expect(result).toEqual(userEntity);
        })

        it("should return null when user does not exist", async () => {
            mockedFindUnique.mockResolvedValue(null);
            const result = await userRepository.findByEmail(testUserData.email);
            expect(result).toBeNull();
        });

        it("should throw error when findUnique throws error", async () => {
            mockedFindUnique.mockRejectedValue(new Error("Test error"));
            await expect(userRepository.findByEmail(testUserData.email)).rejects.toThrow("Test error");
        });
    });

    describe("save", () => {
        beforeEach(() => {
            mockedUpsert.mockReset();
        });

        it('should save a new user without throwing an error', async () => {
            mockedUpsert.mockResolvedValue(mockUser);
            await expect(userRepository.save(userEntity)).resolves.toEqual(userEntity);
        });

        it('should update an existing user without throwing an error', async () => {
            mockedUpsert.mockResolvedValue(mockUser);
            await expect(userRepository.save(userEntity)).resolves.toEqual(userEntity);
        });

        it('should throw an error when upsert throws an error', async () => {
            mockedUpsert.mockRejectedValue(new Error('Test error'));
            await expect(userRepository.save(userEntity)).rejects.toThrow('Test error');
        });
    });

    describe("delete", () => {
        beforeEach(() => {
            mockedDelete.mockReset();
        });
    
        it('should delete a user without throwing an error', async () => {
            mockedDelete.mockResolvedValue({});
            await expect(userRepository.delete(testUserData.id)).resolves.not.toThrow();
        });
    
        it('should throw an error when delete throws an error', async () => {
            mockedDelete.mockRejectedValue(new Error('Test error'));
            await expect(userRepository.delete(testUserData.id)).rejects.toThrow('Test error');
        });
    });
    
});
