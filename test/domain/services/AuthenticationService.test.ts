import { User } from "../../../src/domain/entities/User"
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository"
import { AuthenticationService } from "../../../src/domain/services/AuthenticationService"
import { Email } from "../../../src/domain/vo/Email"
import { Name } from "../../../src/domain/vo/Name"
import { Password } from "../../../src/domain/vo/Password"
import { UserId } from "../../../src/domain/vo/UserId"

describe("AuthenticationService", () => {
    const testUser = new User(
        new UserId("id"),
        new Name("name"),
        new Email("test@example.com"),
        new Password("password")
    );

    it("should authenticate a valid user", async () => {
        const mockUserRepo: IUserRepository = {
            find: jest.fn(),
            save: jest.fn(),
            findByEmail: jest.fn().mockResolvedValue(testUser),
            delete: jest.fn()
        };

        const service = new AuthenticationService(mockUserRepo);
        const result = await service.authenticate(new Email("test@example.com"), new Password("password"));

        expect(result).toBeInstanceOf(User);

    });

    it("should throw an error for a non-existing user", async () => {
        const mockUserRepo: IUserRepository = {
            find: jest.fn(),
            save: jest.fn(),
            findByEmail: jest.fn().mockResolvedValue(null),
            delete: jest.fn()
        };

        const service = new AuthenticationService(mockUserRepo);

        await expect(service.authenticate(new Email("test@example.com"), new Password("password"))).rejects.toThrow("User not found");
    });

    it("should throw an error for a user with invalid password", async () => {
        const mockUserRepo: IUserRepository = {
            find: jest.fn(),
            save: jest.fn(),
            findByEmail: jest.fn().mockResolvedValue(testUser),
            delete: jest.fn()
        };

        const service = new AuthenticationService(mockUserRepo);

        await expect(service.authenticate(new Email("test@example.com"), new Password("wrongpassword"))).rejects.toThrow("Invalid password");
    })
});
