export class Title {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('Title must not be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
