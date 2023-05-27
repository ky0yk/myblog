import express from 'express';
import { UserController } from './presentation/Controller/UserController';
import { UserRouter } from './presentation/Router/UserRouter';
import { PostController } from './presentation/Controller/PostController';
import { PostRouter } from './presentation/Router/PostRouter';
import { AuthController } from './presentation/Controller/AuthController';
import { AuthRouter } from './presentation/Router/AuthRouter';

const app = express();
const port = 3000;

const userController = new UserController();
const userRouter = new UserRouter(userController);

const postController = new PostController();
const postRouter = new PostRouter(postController);

const authController = new AuthController();
const authRouter= new AuthRouter(authController);


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/users', userRouter.router);
app.use('/posts', postRouter.router);
app.use('/auth', authRouter.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
