import express from 'express';

import { UserRouter } from './presentation/router/UserRouter';

import { PostRouter } from './presentation/router/PostRouter';

import { AuthRouter } from './presentation/router/AuthRouter';
import { UserController } from './presentation/controller/UserController';
import { PostController } from './presentation/controller/PostController';
import { AuthController } from './presentation/controller/AuthController';

const app = express();
const port = 3000;

const userController = new UserController();
const userRouter = new UserRouter(userController);

const postController = new PostController();
const postRouter = new PostRouter(postController);

const authController = new AuthController();
const authRouter= new AuthRouter(authController);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use('/users', userRouter.router);
app.use('/posts', postRouter.router);
app.use('/auth', authRouter.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
