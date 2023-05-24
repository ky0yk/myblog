import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/vo/Email";
import { Name } from "../../domain/vo/Name";
import { Password } from "../../domain/vo/Password";
import { UserId } from "../../domain/vo/UserId";

export class UserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async createUser(id: string, name: string, email: string, password: string): Promise<User> {

        const user = new User(new UserId(id), new Name(name), new Email(email), new Password(password));
        await this.userRepository.save(user);

        const createdUser = await this.userRepository.find(user.id);
        if (!createdUser) {
            throw new Error("User could not be created");
        }
        return createdUser;
    };

    async getUser(userId: string): Promise<User | null> {
        return this.userRepository.find(new UserId(userId));
    };

    async updateUser(userId: UserId, updateData: Partial<User>): Promise<User> {
        const user = await this.userRepository.find(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.update(updateData);
        await this.userRepository.save(user);

        const updatedUser = await this.userRepository.find(user.id);
        if (!updatedUser) {
            throw new Error("User could not be updated");
        }
        return updatedUser;
    }

    async deleteUser(userId: string): Promise<void> {
        await this.userRepository.delete(new UserId(userId));
    };
}
