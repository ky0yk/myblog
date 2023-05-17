export class CommentBody {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('CommentBody must not be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
