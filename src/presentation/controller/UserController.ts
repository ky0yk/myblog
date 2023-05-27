import { Request, Response } from 'express';

export class UserController {
    createUser(req: Request, res: Response) {
        res.status(201).json({ message: 'User created' });
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
