import { Email } from "../vo/Email";
import { Name } from "../vo/Name";
import { Password } from "../vo/Password";
import { UserId } from "../vo/UserId";

export class User {
    private id: UserId;
    private name: Name;
    private email: Email;
    private password: Password;

    constructor(id: UserId, name: Name, email: Email, password: Password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    verifyPassword(inputPassword: Password):boolean {
        return this.password.equals(inputPassword)
    }

    getId(): UserId {
        return this.id;
    }

    getName(): Name {
        return this.name;
    }

    getEmail(): Email {
        return this.email;
    }

    getPassword(): Password {
        return this.password;
    }
}
