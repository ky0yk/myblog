export class UserId {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('UserId must not be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
