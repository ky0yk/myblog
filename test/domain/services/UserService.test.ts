import { PrismaClient } from "@prisma/client";
import { User, UserCreateDto, UserUpdateDto } from "../../../src/domain/entities/User";
import { UserService } from "../../../src/domain/services/UserService";
import { UserRepository } from "../../../src/infrastructure/repositories/UserRepository";
import { UserId } from "../../../src/domain/vo/UserId";
import { Password } from "../../../src/domain/vo/Password";
import { Email } from "../../../src/domain/vo/Email";
import { Name } from "../../../src/domain/vo/Name";

jest.mock('../../../src/utils/passwordHasher', () => ({
    hashPassword: jest.fn().mockImplementation(password => Promise.resolve(password)),
}));

jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn().mockImplementation(() => {
        return {
          user: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
            delete: jest.fn(),
          },
        }
      }),
    }
  })


describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let userDto: UserCreateDto;
  let user: User;
  let prisma: PrismaClient;

  beforeEach(() => {
    userRepository = new UserRepository(prisma);
    userService = new UserService(userRepository);
    userDto = {
      name: new Name("Test Name"),
      email: new Email("test@example.com"),
      password: new Password("hashedpassword"),
    };
    user = new User(
      new UserId("someId"),
      userDto.name,
      userDto.email,
      new Password(userDto.password.value)
    );
  });
  
  describe("register", () => {
    it("should create a new user and return user details", async () => {
      jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
      jest.spyOn(userRepository, "save").mockResolvedValue(user);

      const result = await userService.register(userDto);
      
      expect(result).toEqual({
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
      });
    });
  });

  describe("get", () => {
    it("should return user details if user exists", async () => {
      jest.spyOn(userRepository, "find").mockResolvedValue(user);

      const result = await userService.get(user.id);
      
      expect(result).toEqual({
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
      });
    });
  });

  describe("update", () => {
    it("should update a user and return the updated user details", async () => {
      jest.spyOn(userRepository, "find").mockResolvedValue(user);
      const mockSave = jest.spyOn(userRepository, "save").mockResolvedValue(user);

      const updatedUserDto: UserUpdateDto = {
        name: "Updated Name",
        email: "updated@example.com",
        password: "updatedpassword",
      };

      const result = await userService.update(user.id, updatedUserDto);

      const updatedUser = mockSave.mock.calls[0][0];
      expect(updatedUser.password.value).toBe(updatedUserDto.password);

      expect(result).toEqual({
        id: user.id.value,
        name: updatedUserDto.name,
        email: updatedUserDto.email,
      });
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      jest.spyOn(userRepository, "find").mockResolvedValue(user);
      jest.spyOn(userRepository, "delete").mockResolvedValue();

      await userService.delete(user.id);

      expect(userRepository.delete).toHaveBeenCalledWith(user.id);
    });
  });
});
