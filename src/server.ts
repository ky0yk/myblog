import express from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { UserUseCase } from "./application/usecases/UserUseCase";
import { UserController } from "./presentation/controller/UserController";
import { UserRouter } from "./presentation/router.ts/UserRouter";

const app = express();
const port = 3000;

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);
const userRouter = new UserRouter(userController);


app.use("/user", userRouter.router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
