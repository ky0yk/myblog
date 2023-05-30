
import { User, UserCreateDto, UserResponse, UserUpdateDto } from "../../domain/entities/User";
import { UserId } from "../../domain/vo/UserId";
import { Password } from "../../domain/vo/Password";
import { hashPassword } from "../../utils/passwordHasher";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

import { v4 as uuidv4 } from "uuid";
import { Name } from "../vo/Name";
import { Email } from "../vo/Email";


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

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id.value,
      name: savedUser.name.value,
      email: savedUser.email.value
    };
  }

  async get(userId: UserId): Promise<UserResponse> {
    const user = await this.userRepository.find(userId);
    if (!user) {
        throw new Error("User not found.");
    }

    return {
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
    };
    }

    async update(userId: UserId, userDto: UserUpdateDto): Promise<UserResponse> {
        const user = await this.userRepository.find(userId);
        if (!user) {
          throw new Error("User not found.");
        }
      
        const { name, email, password } = userDto;
      
        // Create a new UserUpdateDto instance that contains either new values or the existing ones
        const updatedUserDto: UserUpdateDto = {
            name: name ? name : user.name.value,
            email: email ? email : user.email.value,
            password: password ? await hashPassword(new Password(password)) : user.password.value
        };
        
      
        // Update the user with the new values
        const updatedUser = user.updateWithDto(updatedUserDto);
        await this.userRepository.save(updatedUser);
      
        return {
          id: updatedUser.id.value,
          name: updatedUser.name.value,
          email: updatedUser.email.value
        };
      }
      
  async delete(userId: UserId): Promise<void> {
    const user = await this.userRepository.find(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    await this.userRepository.delete(user.id);
  }
}
