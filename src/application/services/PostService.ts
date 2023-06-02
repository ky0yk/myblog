
import { Post } from '../../domain/entities/Post';
import { Content } from '../../domain/vo/Content';
import { PostId } from '../../domain/vo/PostId'
import { Title } from '../../domain/vo/Title';
import { UserId } from '../../domain/vo/UserId';
import { PostRepository } from '../../infrastructure/repositories/PostRepository'
import { PostCreateDto } from '../dto/post/PostCreateDto';
import { PostResponseDto } from '../dto/post/PostResonseDto';
import { PostUpdateDto } from '../dto/post/PostUpdateDto';
import { v4 as uuidv4 } from "uuid";

export class PostService {
  constructor(private postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  private toDto(post: Post): PostResponseDto {
    return {
      id: post.id.value,
      authorId: post.authorId.value,
      title: post.title.value,
      content: post.content.value,
      isPublished: post.isPublished,
      createdAt: post.createdAt?.toISOString() ?? '',
      updatedAt: post.updatedAt?.toISOString() ?? ''
    };
  }

  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.findAll();
    return posts.map(this.toDto);
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
