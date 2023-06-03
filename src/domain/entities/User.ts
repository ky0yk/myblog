import { UserUpdateDto } from '../../application/dto/user/UserUpdateDto'
import { Email } from '../vo/Email'
import { Name } from '../vo/Name'
import { Password } from '../vo/Password'
import { UserId } from '../vo/UserId'

export class User {
  private _id: UserId
  private _name: Name
  private _email: Email
  private _password: Password

  constructor(id: UserId, name: Name, email: Email, password: Password) {
    this._id = id
    this._name = name
    this._email = email
    this._password = password
  }

  verifyPassword(inputPassword: Password): boolean {
    return this._password.equals(inputPassword)
  }

  updateWithDto(updateDto: UserUpdateDto): User {
    let updatedUser = new User(
      this._id,
      this._name,
      this._email,
      this._password
    )

    if (updateDto.name) {
      updatedUser = updatedUser.updateName(new Name(updateDto.name))
    }
    if (updateDto.email) {
      updatedUser = updatedUser.updateEmail(new Email(updateDto.email))
    }
    if (updateDto.password) {
      updatedUser = updatedUser.updatePassword(new Password(updateDto.password))
    }

    return updatedUser
  }

  updateName(newName: Name): User {
    return new User(this._id, newName, this._email, this._password)
  }

  updateEmail(newEmail: Email): User {
    return new User(this._id, this._name, newEmail, this._password)
  }

  updatePassword(newPassword: Password): User {
    return new User(this._id, this._name, this._email, newPassword)
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get email() {
    return this._email
  }

  get password() {
    return this._password
  }
}
