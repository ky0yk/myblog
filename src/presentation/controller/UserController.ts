import { Request, Response } from 'express';
import { Email } from '../../domain/vo/Email';
import { Name } from "../../domain/vo/Name";
import { Password } from "../../domain/vo/Password";
import { UserCreateDto } from '../../domain/entities/User';
import { AuthService } from '../../application/AuthService';
import { UserService } from '../../domain/services/UserService';

export class UserController {
    private userService: UserService;
    private authService: AuthService;

    constructor(userService: UserService, authService: AuthService){
        this.userService = userService;
        this.authService = authService;
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const userCreateDto: UserCreateDto = {
                name: new Name(req.body.name),
                email: new Email(req.body.email),
                password: new Password(req.body.password)
            }
            
            const user = await this.userService.register(userCreateDto);

            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
    }

    getUser(req: Request, res: Response) {
        const userId = req.params.userId;
        res.status(200).json({ message: `User with ID: ${userId}` });
    }

    updateUser(req: Request, res: Response) {
        const userId = req.params.userId;
        res.status(200).json({ message: `User with ID: ${userId} updated` });
    }

    deleteUser(req: Request, res: Response) {
        const userId = req.params.userId;
        res.status(200).json({ message: `User with ID: ${userId} deleted` });
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
