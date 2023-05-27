import { User, UserCreateDto, UserResponse } from "../domain/entities/User";
import { UserId } from "../domain/vo/UserId";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { v4 as uuidv4 } from 'uuid';

export class UserRegistrationService {
    constructor(private userRepository: UserRepository) {}
  
    async register(userDto: UserCreateDto): Promise<UserResponse> {
      const { email, name, password } = userDto;
  
      const foundUser = await this.userRepository.findByEmail(email);
      if (foundUser) {
        throw new Error("Email already in use.");
      }
  
      const user = new User(
        new UserId(uuidv4()),
        name,
        email,
        password,
      );
  
      const savedUser = await this.userRepository.save(user);
  
      return {
        id: savedUser.id.value,
        name: savedUser.name.value,
        email: savedUser.email.value
      };
    }
  }
