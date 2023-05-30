import express from 'express';

import { UserRouter } from './presentation/router/UserRouter';
import { PostRouter } from './presentation/router/PostRouter';
import { UserController } from './presentation/controller/UserController';
import { PostController } from './presentation/controller/PostController';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './application/AuthService';
import { UserService } from './domain/services/UserService';

const app = express();
const port = 3000;

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);

const userController = new UserController(userService, authService);
const userRouter = new UserRouter(userController);

const postController = new PostController();
const postRouter = new PostRouter(postController);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());

app.use('/users', userRouter.router);
app.use('/posts', postRouter.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
