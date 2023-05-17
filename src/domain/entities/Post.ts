export class Post {
    id: string;
    title: string;
    content: string;
    userId: string;

    constructor(id: string, title: string, content: string, userId: string) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.userId = userId;
    }
}