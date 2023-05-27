import { Request, Response } from 'express';
import { UserRegistrationService } from '../../application/UserRegistrationService';
import { Email } from '../../domain/vo/Email';
import { Name } from "../../domain/vo/Name";
import { Password } from "../../domain/vo/Password";
import { UserCreateDto } from '../../domain/entities/User';

export class UserController {
    private userRegistrationService: UserRegistrationService;

    constructor(userRegistrationService:UserRegistrationService){
        this.userRegistrationService = userRegistrationService;
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const userCreateDto: UserCreateDto = {
                name: new Name(req.body.name),
                email: new Email(req.body.email),
                password: new Password(req.body.password)
            }
            
            const user = await this.userRegistrationService.register(userCreateDto);

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
}
