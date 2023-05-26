import { Request, Response } from 'express';
import { User, UserCreateDto, UserUpdateDto } from '../../domain/entities/User';
import { UserId } from '../../domain/vo/UserId';
import { Name } from '../../domain/vo/Name';
import { Email } from '../../domain/vo/Email';
import { Password } from '../../domain/vo/Password';
import { UserUseCase } from '../../application/usecases/UserUseCase';

export class UserController {
    private userUseCase: UserUseCase;

    constructor(userUseCase: UserUseCase) {
        this.userUseCase = userUseCase;
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const createDto: UserCreateDto = {
                name: new Name(req.body.name),
                email: new Email(req.body.email),
                password: new Password(req.body.password),
            };

            const createdUser = await this.userUseCase.createUser(new UserId(req.body.id), createDto);
            res.status(201).json(createdUser);
        } catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = new UserId(req.params.userId);
            const user = await this.userUseCase.getUser(userId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            if (err instanceof TypeError) {
                res.status(400).json({ error: "Invalid UserId format." });
            } else {
                res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
            }
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const updateDto: UserUpdateDto = {
                name: req.body.name ? new Name(req.body.name) : undefined,
                email: req.body.email ? new Email(req.body.email) : undefined,
                password: req.body.password ? new Password(req.body.password) : undefined,
            };

            const updatedUser = await this.userUseCase.updateUser(new UserId(req.params.userId), updateDto);
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = new UserId(req.params.userId);
            await this.userUseCase.deleteUser(userId);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            if (err instanceof TypeError) {
                res.status(400).json({ error: "Invalid UserId format." });
            } else {
                res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
            }
        }
    }
}
