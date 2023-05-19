import { Email } from "../vo/Email";
import { Password } from "../vo/Password";

export class AuthenticationService {
    constructor(private userRepository: UserRepository){}

    async authenticate(email: Email, passowrd: Password): Promise<boolean> {
        // TODO: Implement this method
        return false;
    }
}