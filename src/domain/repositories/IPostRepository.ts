import { Post } from '../entities/Post'
import { PostId } from '../vo/PostId'

export interface IPostRepository {
  findAll(): Promise<Post[]>
  findById(postId: PostId): Promise<Post | null>
  save(post: Post): Promise<Post>
  delete(postId: PostId): Promise<void>
}
