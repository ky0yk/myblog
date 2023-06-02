
import { Post } from '../../domain/entities/Post'
import { PostId } from '../../domain/vo/PostId'
import { PostRepository } from '../../infrastructure/repositories/PostRepository'

export class PostPublishingService {
  constructor(private postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  // async getAllPosts(): Promise<Post[]> {
  //   // logic to get all posts
  // }

  // async getPostById(id: PostId): Promise<Post> {
  //   // logic to get a post by id
  // }

  // async createPost(title: Title, content: Content, authorId: UserId): Promise<Post> {
  //   // logic to create a new post
  // }

  // async updatePost(id: PostId, title: Title, content: Content): Promise<Post> {
  //   // logic to update a post
  // }

  // async deletePost(id: PostId): Promise<void> {
  //   // logic to delete a post
  // }

  async publish(postId: PostId): Promise<void> {
    const post = await this.postRepository.findById(postId)
    if (post == null) {
      throw new Error('Post not found')
    }
    post.publish()
    await this.postRepository.save(post)
  }
}
