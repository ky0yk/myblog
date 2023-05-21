import { Content } from "../vo/Content";
import { PostId } from "../vo/PostId";
import { Title } from "../vo/Title";
import { UserId } from "../vo/UserId";

export class Post {
    private _id: PostId;
    private _title: Title;
    private _content: Content;
    private _authorId: UserId;
    private _isPublished: boolean;

    constructor(id: PostId, title: Title, content: Content, authorId: UserId) {
        this._id = id;
        this._title = title;
        this._content = content;
        this._authorId = authorId;
        this._isPublished = false;
    }

    publish(): void {
        this._isPublished = true;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get content() {
        return this._content;
    }

    get authorId() {
        return this._authorId;
    }

    get isPublished() {
        return this._isPublished;
    }
}
