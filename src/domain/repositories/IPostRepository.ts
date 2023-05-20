import { Post } from "../entities/Post";
import { PostId } from "../vo/PostId";

export interface IPostRepository {
    findById(id: PostId): Promise<Post | null>;
    save(post: Post): Promise<void>;
    delete(post: Post): Promise<void>;
}
