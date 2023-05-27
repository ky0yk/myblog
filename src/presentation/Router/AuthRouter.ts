import express from 'express';
import { AuthController } from '../controller/AuthController';


export class AuthRouter {
    private authController: AuthController;
    public router = express.Router();

    constructor(authController: AuthController) {
        this.authController = authController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', (req, res) => this.authController.login(req, res));
    }
}
