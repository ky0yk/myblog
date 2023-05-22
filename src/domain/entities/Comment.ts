import { CommentBody } from "../vo/CommentBody";
import { CommentId } from "../vo/CommentId";
import { PostId } from "../vo/PostId";
import { UserId } from "../vo/UserId";

export class Comment {
    private _id: CommentId;
    private _body: CommentBody;
    private _authorId: UserId;
    private _postId: PostId;

    constructor(id: CommentId, body: CommentBody, authorId: UserId, postId: PostId) {
        this._id = id;
        this._body = body;
        this._authorId = authorId;
        this._postId = postId;
    }

    get id() {
        return this._id;
    }

    get body() {
        return this._body;
    }

    get authorId() {
        return this._authorId;
    }

    get postId() {
        return this._postId;
    }
}
