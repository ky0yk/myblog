
import { Post } from '../../domain/entities/Post';
import { Content } from '../../domain/vo/Content';
import { PostId } from '../../domain/vo/PostId'
import { Title } from '../../domain/vo/Title';
import { UserId } from '../../domain/vo/UserId';
import { PostRepository } from '../../infrastructure/repositories/PostRepository'
import { PostCreateDto } from '../dto/post/PostCreateDto';
import { PostUpdateDto } from '../dto/post/PostUpdateDto';
import { v4 as uuidv4 } from "uuid";


export class PostService {
  constructor(private postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.findAll();
    return posts;
  }

  async getPostById(id: PostId): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async createPost(postDto: PostCreateDto): Promise<Post> {
    const post = new Post(
      new PostId(uuidv4()),
      new Title(postDto.title),
      new Content(postDto.content),
      new UserId(postDto.authorId),
    );
    const savedPost = await this.postRepository.save(post);
    return savedPost;
  }

  async updatePost(id: PostId, postDto: PostUpdateDto): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    const updatedPost = post.updateWithDto(postDto);
    const savedPost = await this.postRepository.save(updatedPost);

    return savedPost;
  }

  async deletePost(id: PostId): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    await this.postRepository.delete(id);
  }

  async publish(postId: PostId): Promise<void> {
    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw new Error('Post not found')
    }
    post.publish()
    await this.postRepository.save(post)
  }
}
