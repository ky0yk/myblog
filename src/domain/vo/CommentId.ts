export class CommentId {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('CommentId must not be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
