export class PostId {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('PostId must not be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
