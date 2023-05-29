import express from 'express';

import { UserRouter } from './presentation/router/UserRouter';
import { PostRouter } from './presentation/router/PostRouter';
import { AuthRouter } from './presentation/router/AuthRouter';
import { UserController } from './presentation/controller/UserController';
import { PostController } from './presentation/controller/PostController';
import { AuthController } from './presentation/controller/AuthController';
import { UserRegistrationService } from './application/UserRegistrationService';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './application/AuthService';

const app = express();
const port = 3000;

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userRegistrationService = new UserRegistrationService(userRepository);
const userController = new UserController(userRegistrationService);
const userRouter = new UserRouter(userController);

const postController = new PostController();
const postRouter = new PostRouter(postController);

const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
const authRouter= new AuthRouter(authController);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());

app.use('/users', userRouter.router);
app.use('/posts', postRouter.router);
app.use('/auth', authRouter.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
