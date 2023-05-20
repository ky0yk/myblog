export class Password {
    private value: string;

    constructor(value: string) {
        if (!this.isValidPassword(value)) {
            throw new Error('Invalid password format');
        }
        this.value = value;
    }

    getValue(): String {
        return this.value;
    }

    equals(other: Password): boolean {
        return this.value === other.getValue();
    }

    private isValidPassword(password: string): boolean {
        return password.length >= 8;
    }
}
