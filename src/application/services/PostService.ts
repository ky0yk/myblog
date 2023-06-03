
import { Post } from '../../domain/entities/Post';
import { Content } from '../../domain/vo/Content';
import { PostId } from '../../domain/vo/PostId'
import { PostSummary } from '../../domain/vo/PostSummary';
import { Title } from '../../domain/vo/Title';
import { UserId } from '../../domain/vo/UserId';
import { PostRepository } from '../../infrastructure/repositories/PostRepository'
import { PostCreateDto } from '../dto/post/PostCreateDto';
import { PostResponseDto } from '../dto/post/PostResponseDto';
import { PostUpdateDto } from '../dto/post/PostUpdateDto';
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export class PostService {
  constructor(private postRepository: PostRepository, private userRepository: UserRepository) {}

  private toDto(post: Post): PostResponseDto {
    return {
      id: post.id.value,
      authorId: post.authorId.value,
      title: post.title.value,
      content: post.content.value,
      isPublished: post.isPublished,
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString()
    };
  }

  async getAllPosts(): Promise<PostSummary[]> {
    const posts = await this.postRepository.findAll();
    
    const authorIds = posts.map(post => post.authorId);
    const users = await this.userRepository.findUsersByIds(authorIds);
    
    const userMap = new Map();
    users.forEach(user => userMap.set(user.id.value, user.name.value));
    
    const postSummaries = posts.map(post => {
      const authorName = userMap.get(post.authorId.value);
      return new PostSummary(
        post.id,
        post.title,
        post.content.shortVersion(),
        authorName,
        post.createdAt as Date,
        post.updatedAt as Date
      );
    });
  
    return postSummaries;
  }

  async getPostById(id: PostId): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return this.toDto(post);
  }

  async createPost(postDto: PostCreateDto): Promise<PostResponseDto> {
    const post = new Post(
      new PostId(uuidv4()),
      new Title(postDto.title),
      new Content(postDto.content),
      new UserId(postDto.authorId),
    );
    const savedPost = await this.postRepository.save(post);
    return this.toDto(savedPost);
  }

  async updatePost(id: PostId, postDto: PostUpdateDto): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    const updatedPost = post.updateWithDto(postDto);
    const savedPost = await this.postRepository.save(updatedPost);

    return this.toDto(savedPost);
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
