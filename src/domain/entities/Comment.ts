export class Comment{
    id: string;
    body: string;
    userId: string;
    postId: string;

    constructor(id: string, body: string, userId: string, postId: string) {
        this.id = id;
        this.body = body;
        this.userId = userId;
        this.postId = postId;
    }
}
