import { User, UserCreateDto, UserUpdateDto } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserId } from "../../domain/vo/UserId";

export class UserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async createUser(id: UserId, createData: UserCreateDto): Promise<User> {
        const user = new User(id, createData.name, createData.email, createData.password);
        const savedUser = await this.userRepository.save(user);

        if (!savedUser) {
            throw new Error("User could not be created");
        }
        return savedUser;
    }

    async getUser(userId: UserId): Promise<User | null> {
        return this.userRepository.find(userId);
    };

    async updateUser(userId: UserId, updateData: UserUpdateDto): Promise<User> {
        const user = await this.userRepository.find(userId);
        if (!user) {
            throw new Error(`User with ID ${userId.value} not found`);
        }

        const updatedUser = user.updateWithDto(updateData);
        const savedUser = await this.userRepository.save(updatedUser);

        if (!savedUser) {
            throw new Error(`User with ID ${userId.value} could not be updated`);
        }
        return savedUser;
    }

    async deleteUser(userId: UserId): Promise<void> {
        await this.userRepository.delete(userId);
    };
}
