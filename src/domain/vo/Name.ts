export class Name {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('Name must not be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
