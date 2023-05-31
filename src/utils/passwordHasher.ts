import bcrypt from 'bcrypt';
import { Password } from '../domain/vo/Password';

export async function hashPassword(password: Password): Promise<Password> {
    const hashed = await bcrypt.hash(password.value, 10);
    return new Password(hashed);
}

export async function comparePassword(password:Password, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password.value, hashedPassword);
}