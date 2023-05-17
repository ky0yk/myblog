import { CommentBody } from "../vo/CommentBody";
import { CommentId } from "../vo/CommentId";
import { PostId } from "../vo/PostId";
import { UserId } from "../vo/UserId";

export class Comment {
    private id: CommentId;
    private body: CommentBody;
    private authorId: UserId;
    private postId: PostId;

    constructor(id: CommentId, body: CommentBody, authorId: UserId, postId: PostId) {
        this.id = id;
        this.body = body;
        this.authorId = authorId;
        this.postId = postId;
    }

    getId(): CommentId {
        return this.id;
    }

    getBody(): CommentBody {
        return this.body;
    }

    getAuthorId(): UserId {
        return this.authorId;
    }

    getPostId(): PostId {
        return this.postId;
    }
}
