export class PostId {
    private _value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('PostId must not be empty');
        }
        this._value = value;
    }

    get value(): string {
        return this._value;
    }
}
