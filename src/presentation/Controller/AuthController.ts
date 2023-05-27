import { Request, Response } from 'express';

export class AuthController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(){}

    async login(req: Request, res: Response): Promise<void> {
        res.json({message: "auth"})
    }
}
