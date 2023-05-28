import { Email } from "../domain/vo/Email";
import { Password } from "../domain/vo/Password";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { comparePassword } from "../utils/passwordHasher";

export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async login(email: Email, password: Password): Promise<string | null> {
        const user = await this.userRepository.findByEmail(email);

        if (user && await comparePassword(password.value, user.password.value)) {
            // TODO トークン生成ロジック
            
            return 'logged in';
        } else {
            return null;
        }
    }
}