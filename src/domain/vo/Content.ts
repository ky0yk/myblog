export class Content {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('Content must not be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
