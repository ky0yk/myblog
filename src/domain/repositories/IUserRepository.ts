import { User } from "../entities/User";
import { UserId } from "../vo/UserId";

export interface IUserRepository {
    find(id: UserId): Promise<User | null>;
    save(user: User): Promise<void>;
}
