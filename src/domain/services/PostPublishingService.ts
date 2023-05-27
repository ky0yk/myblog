import { IPostRepository } from '../repositories/IPostRepository'
import { PostId } from '../vo/PostId'

export class PostPublishingService {
  constructor(private postRepository: IPostRepository) {
    this.postRepository = postRepository
  }

  async publish(postId: PostId): Promise<void> {
    const post = await this.postRepository.findById(postId)
    if (post == null) {
      throw new Error('Post not found')
    }
    post.publish()
    await this.postRepository.save(post)
  }
}
