import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserId } from "../../domain/vo/UserId";
import { User } from "../../domain/entities/User";
import { Name } from "../../domain/vo/Name";
import { Email } from "../../domain/vo/Email";
import { Password } from "../../domain/vo/Password";
import { hashPassword } from "../../utils/passwordHasher";

export class UserRepository implements IUserRepository {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }

    async find(id: UserId): Promise<User | null> {
        const result = await this._prisma.user.findUnique({ where: {id: id.value} });

        if (result == null) {
            return null;
        }

        return new User(
            new UserId(result.id),
            new Name(result.name),
            new Email(result.email),
            new Password(result.password)
        );
    }

    async findByEmail(email: Email): Promise<User | null> {
        const result = await this._prisma.user.findUnique({ where: { email: email.value}})

        if (result == null) {
            return null;
        }

        return new User(
            new UserId(result.id),
            new Name(result.name),
            new Email(result.email),
            new Password(result.password)
        );
    }


    async save(user: User): Promise<User> {
        const {id , name, email, password } = user;
        const hashedPassword = await hashPassword(password);

        const result = await this._prisma.user.upsert({
            where: {id: id.value},
            update: {name: name.value, email: email.value, password: hashedPassword},
            create: { id: id.value, name: name.value, email: email.value, password: hashedPassword}
        });

        return new User(new UserId(result.id), new Name(result.name), new Email(result.email), new Password(result.password));
    }


    async delete(id: UserId): Promise<void> {
        await this._prisma.user.delete({
            where: { id: id.value }
        });
    }

}