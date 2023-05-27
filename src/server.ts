import express from 'express';
import { UserController } from './presentation/Controller/UserController';
import { UserRouter } from './presentation/Router/UserRouter';

const app = express();
const port = 3000;

const userController = new UserController();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const userRouter = new UserRouter(userController);
app.use('/users', userRouter.router);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
