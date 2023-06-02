import { Request, Response } from 'express';
import { Email } from '../../domain/vo/Email';
import { Name } from "../../domain/vo/Name";
import { Password } from "../../domain/vo/Password";
import { AuthService } from '../../application/services/AuthService';
import { UserId } from '../../domain/vo/UserId';
import { UserService } from '../../application/services/UserService';
import { UserCreateDto } from '../../application/dto/user/UserCreateDto';
import { UserUpdateDto } from '../../application/dto/user/UserUpdateDto';

export class UserController {
    private userService: UserService;
    private authService: AuthService;

    constructor(userService: UserService, authService: AuthService){
        this.userService = userService;
        this.authService = authService;
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const userCreateDto: UserCreateDto = req.body;

            const user = await this.userService.register(userCreateDto);

            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = new UserId(req.params.userId);
            const user = await this.userService.get(userId);
            res.json(user);
        } catch(err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = new UserId(req.params.userId);
            const { name, email, password } = req.body;
            const updatedUserDto: UserUpdateDto = { name, email, password };
            const updatedUser = await this.userService.update(userId, updatedUserDto);
            res.json(updatedUser);
        } catch(err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
    }
    

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = new UserId(req.params.userId);
            await this.userService.delete(userId);
            res.sendStatus(204);
        } catch(err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
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
