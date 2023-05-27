import express from 'express';
import { UserController } from '../controller/UserController';

export class UserRouter {
    private userController: UserController;
    public router = express.Router();

    constructor(userController: UserController) {
        this.userController = userController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', (req, res) => this.userController.createUser(req, res));
        this.router.get('/:userId', (req, res) => this.userController.getUser(req, res));
        this.router.put('/:userId', (req, res) => this.userController.updateUser(req, res));
        this.router.delete('/:userId', (req, res) => this.userController.deleteUser(req, res));
    }
}