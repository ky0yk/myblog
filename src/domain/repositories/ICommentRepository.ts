import { Comment } from "../entities/Comment";
import { CommentId } from "../vo/CommentId";
import { PostId } from "../vo/PostId";

export interface ICommentRepository {
  findAllByPostId(postId: PostId): Promise<Comment[]>;
  findById(id: CommentId): Promise<Comment | null>;
  save(comment: Comment): Promise<Comment>;
  delete(id: CommentId): Promise<void>;
}
