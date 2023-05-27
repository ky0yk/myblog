import { Request, Response } from 'express';

export class AuthController {
    constructor(){}

    async login(req: Request, res: Response): Promise<void> {
        res.json({message: "auth"})
    }
}
