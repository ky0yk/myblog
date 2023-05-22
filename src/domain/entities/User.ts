import { Email } from "../vo/Email";
import { Name } from "../vo/Name";
import { Password } from "../vo/Password";
import { UserId } from "../vo/UserId";

export class User {
    private _id: UserId;
    private _name: Name;
    private _email: Email;
    private _password: Password;

    constructor(id: UserId, name: Name, email: Email, password: Password) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
    }

    verifyPassword(inputPassword: Password):boolean {
        return this.password.equals(inputPassword)
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }
}
