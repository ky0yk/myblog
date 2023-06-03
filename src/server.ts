import express from 'express';

import { UserController } from './presentation/controller/UserController';
import { PostController } from './presentation/controller/PostController';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './application/services/AuthService';
import { UserRouter } from './presentation/Router/UserRouter';
import { PostRouter } from './presentation/Router/PostRouter';
import { UserService } from './application/services/UserService';
import { PostRepository } from './infrastructure/repositories/PostRepository';
import { PostService } from './application/services/PostService';

const app = express();
const port = 3000;

const prisma = new PrismaClient();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);
const userController = new UserController(userService, authService);
const userRouter = new UserRouter(userController);

const postRepository = new PostRepository(prisma);
const postService = new PostService(postRepository);
const postController = new PostController(postService);
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
