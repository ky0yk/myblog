import { Comment } from '../../domain/entities/Comment'
import { CommentBody } from '../../domain/vo/CommentBody'
import { CommentId } from '../../domain/vo/CommentId'
import { PostId } from '../../domain/vo/PostId'
import { UserId } from '../../domain/vo/UserId'
import { CommentRepository } from '../../infrastructure/repositories/CommentRepository'
import { v4 as uuidv4 } from 'uuid'
import { UserRepository } from '../../infrastructure/repositories/UserRepository'
import { CommentResponseDto } from '../dto/comment/CommentResponseDto'
import { CommentCreateDto } from '../dto/comment/CommentCreateDto'
import { CommentUpdateDto } from '../dto/comment/CommentUpdateDto'
import { User } from '../../domain/entities/User'

export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private userRepository: UserRepository
  ) {}

private toDto(comment: Comment, authorName: string): CommentResponseDto {
    return {
      id: comment.id.value,
      body: comment.body.value,
      authorId: comment.authorId.value,
      authorName: authorName,
      postId: comment.postId.value,
      createdAt: comment.createdAt?.toISOString(),
      updatedAt: comment.updatedAt?.toISOString(),
    }
  }

  async getCommentsByPostId(id: PostId): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.findCommentsByPostId(id)

    const authorIds = comments.map((comment) => comment.authorId)
    const users = await this.userRepository.findUsersByIds(authorIds)

    const userMap = new Map()
    users.forEach((user) => userMap.set(user.id.value, user.name.value))

    return comments.map((comment) => {
      const authorName = userMap.get(comment.authorId.value) ?? 'Unknown'
      return this.toDto(comment, authorName)
    })
  }
  async getCommentByCommentId(id: CommentId): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findById(id)
    if (!comment) {
      throw new Error('Comment not found')
    }
    const user = await this.getUserByUserId(comment.authorId);

    return this.toDto(comment, user.name.value)
  }

  async createComment(commentDto: CommentCreateDto): Promise<CommentResponseDto> {
    const comment = new Comment(
      new CommentId(uuidv4()),
      new CommentBody(commentDto.body),
      new UserId(commentDto.authorId),
      new PostId(commentDto.postId)
    )
    const savedComment = await this.commentRepository.save(comment)
    const user = await this.getUserByUserId(comment.authorId);

    return this.toDto(savedComment, user.name.value)
  }

  async updateComment(
    id: CommentId,
    commentDto: CommentUpdateDto
  ): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findById(id)
    if (!comment) {
      throw new Error('Comment not found')
    }

    const updatedComment = comment.updateWithDto(commentDto);
    const savedComment = await this.commentRepository.save(updatedComment);
    const user = await this.getUserByUserId(comment.authorId);

    return this.toDto(savedComment, user.name.value)
  }

  async deleteComment(id: CommentId): Promise<void> {
    const comment = await this.commentRepository.findById(id)
    if (!comment) {
      throw new Error('Comment not found')
    }

    await this.commentRepository.delete(id)
  }

  private async getUserByUserId(userId: UserId): Promise<User> {
    const user = await this.userRepository.find(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  
}
