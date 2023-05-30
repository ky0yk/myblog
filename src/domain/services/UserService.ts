
import { User, UserCreateDto, UserResponse, UserUpdateDto } from "../../domain/entities/User";
import { UserId } from "../../domain/vo/UserId";
import { Password } from "../../domain/vo/Password";
import { hashPassword } from "../../utils/passwordHasher";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

import { v4 as uuidv4 } from "uuid";


export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(userDto: UserCreateDto): Promise<UserResponse> {
    const { email, name, password } = userDto;

    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser) {
      throw new Error("Email already in use.");
    }

    const hashedPassword = await hashPassword(password);
    const user = new User(
      new UserId(uuidv4()),
      name,
      email,
      new Password(hashedPassword),
    );
    console.log(user)

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id.value,
      name: savedUser.name.value,
      email: savedUser.email.value
    };
  }

  async get(userId: string): Promise<UserResponse> {
    const id = new UserId(userId);
    const user = await this.userRepository.find(id);
    if (!user) {
        throw new Error("User not found.");
    }

    return {
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
    };
    }

  async update(id: UserId, userDto: UserUpdateDto): Promise<UserResponse> {
    const { email, name, password } = userDto;
  
    const user = await this.userRepository.find(id);
    if (!user) {
      throw new Error("User not found.");
    }
  
    const hashedPassword = password ? await hashPassword(password) : user.password.value;
    const updatedUserDto = { name, email, password: new Password(hashedPassword) } as UserUpdateDto;
  
    const updatedUser = user.updateWithDto(updatedUserDto);
  
    await this.userRepository.save(updatedUser);
  
    return {
      id: updatedUser.id.value,
      name: updatedUser.name.value,
      email: updatedUser.email.value
    };
  }
  
  

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.find(new UserId(id));
    if (!user) {
      throw new Error("User not found.");
    }

    await this.userRepository.delete(user.id);
  }
}
