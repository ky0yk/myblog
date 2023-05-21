export class CommentBody {
    private _value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('CommentBody must not be empty');
        }
        this._value = value;
    }

    get value() {
        return this._value;
    }
}
