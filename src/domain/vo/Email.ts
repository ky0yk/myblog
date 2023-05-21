export class Email {
    private _value: string;

    constructor(value: string) {
        if (!this.isValidEmail(value)) {
            throw new Error('Invalid email format');
        }
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    private isValidEmail(email: string): boolean {
        return email.includes('@');
    }
}