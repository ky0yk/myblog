import { Email } from "../../domain/vo/Email";
import { Password } from "../../domain/vo/Password";
import { UserId } from "../../domain/vo/UserId";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { comparePassword } from "../../utils/passwordHasher";
import jwt from 'jsonwebtoken';


export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async login(email: Email, password: Password): Promise<string | null> {
        const user = await this.userRepository.findByEmail(email);

        if (user && await comparePassword(password, user.password.value)) {
            return this.createJwt(user.id);
        } else {
            return null;
        }
    }

    private createJwt(userId: UserId): string {
        const id = userId.value;

        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error('JWT_SECRET_KEY is not defined.');
        }
    
        const token = jwt.sign(
            {
                id,
            },
            secretKey,
            { expiresIn: '1h' } // Set token to expire in 1 hour
        );
    
        return token;
    }
}
