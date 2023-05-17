export class Email {
    private value: string;

    constructor(value: string) {
        if (!this.isValidEmail(value)) {
            throw new Error('Invalid email format');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    private isValidEmail(email: string): boolean {
        return email.includes('@');
    }
}