import { Content } from "../vo/Content";
import { PostId } from "../vo/PostId";
import { Title } from "../vo/Title";
import { UserId } from "../vo/UserId";

export class Post {
    private id: PostId;
    private title: Title;
    private content: Content;
    private authorId: UserId;
    private isPublished: boolean;

    constructor(id: PostId, title: Title, content: Content, authorId: UserId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.isPublished = false;
    }

    publish(): void {
        this.isPublished = true;
    }

    getId(): PostId {
        return this.id;
    }

    getTitle(): Title {
        return this.title;
    }

    getContent(): Content {
        return this.content;
    }

    getAuthorId(): UserId {
        return this.authorId;
    }

    getIsPublished(): boolean {
        return this.isPublished;
    }
}
