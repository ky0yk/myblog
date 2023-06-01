import { Email } from "../../../domain/vo/Email";
import { Name } from "../../../domain/vo/Name";
import { Password } from "../../../domain/vo/Password";

export interface UserCreateDto {
    name: Name;
    email: Email;
    password: Password;
  }