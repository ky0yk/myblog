import { Request, Response } from 'express';
import { AuthService } from '../../application/AuthService';
import { Email } from '../../domain/vo/Email';
import { Password } from '../../domain/vo/Password';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService){
        this.authService = authService;
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const email = new Email(req.body.email);
            const password = new Password(req.body.password);
            const token = await this.authService.login(email, password);

            if (token) {
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid email or password'});
            }
        } catch(err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
    }
}
