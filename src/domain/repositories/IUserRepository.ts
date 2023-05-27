import { User } from "../entities/User";
import { Email } from "../vo/Email";
import { UserId } from "../vo/UserId";

export interface IUserRepository {
    find(id: UserId): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    save(user: User): Promise<User>;
    delete(id: UserId): Promise<void>;
}