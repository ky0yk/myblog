export class Password {
    private _value: string;

    constructor(value: string) {
        if (!this.isValidPassword(value)) {
            throw new Error('Invalid password format');
        }
        this._value = value;
    }

    get value() {
        return this._value;
    }

    equals(other: Password): boolean {
        return this._value === other.value;
    }

    private isValidPassword(password: string): boolean {
        return password.length >= 8;
    }
}
