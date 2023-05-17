import { User } from "../../../src/domain/entities/User";
import { Email } from "../../../src/domain/vo/Email";
import { Name } from "../../../src/domain/vo/Name";
import { Password } from "../../../src/domain/vo/Password";
import { UserId } from "../../../src/domain/vo/UserId"

describe('User', () => {
    const userId = new UserId('1234');
    const userName = new Name('John Doe');
    const userEmail = new Email('johndoe@example.com');
    const userPassword = new Password('password123');
    const user = new User(userId, userName, userEmail, userPassword);

    describe('getId', () => {
        it('should return the id of the user', () => {
            expect(user.getId().getValue()).toBe('1234');
        });
    });

    describe('getName', () => {
        it('should return the name of the user', () => {
            expect(user.getName().getValue()).toBe('John Doe');
        });
    });

    describe('getEmail', () => {
        it('should return the email of the user', () => {
            expect(user.getEmail().getValue()).toBe('johndoe@example.com');
        });
    });

    describe('getPassword', () => {
        it('should return the password of the user', () => {
            expect(user.getPassword().getValue()).toBe('password123');
        });
    });
})
