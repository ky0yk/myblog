import { PrismaClient, Comment as PrismaComment } from "@prisma/client";
import { PostId } from "../../domain/vo/PostId";
import { CommentId } from "../../domain/vo/CommentId";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { CommentBody } from "../../domain/vo/CommentBody";
import { UserId } from "../../domain/vo/UserId";
import { Comment } from "../../domain/entities/Comment"


export class CommentRepository implements ICommentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAllByPostId(postId: PostId): Promise<Comment[]> {
    const results = await this.prisma.comment.findMany({
      where: { postId: postId.value },
    });

    return results.map(result => this.toEntity(result));
  }

  async findById(id: CommentId): Promise<Comment | null> {
    const result = await this.prisma.comment.findUnique({
      where: { id: id.value },
    });

    if (result == null) {
      return null;
    }

    return this.toEntity(result);
  }

  async save(comment: Comment): Promise<Comment> {
    const { id, body, authorId, postId } = comment;

    const savedRecord = await this.prisma.comment.upsert({
      where: { id: id.value },
      update: {
        body: body.value,
        authorId: authorId.value,
        postId: postId.value,
        updatedAt: new Date(),
      },
      create: {
        id: id.value,
        body: body.value,
        authorId: authorId.value,
        postId: postId.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.toEntity(savedRecord);
  }

  async delete(id: CommentId): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: id.value },
    });
  }

  private toEntity(prismaComment: PrismaComment): Comment {
    const comment = new Comment(
      new CommentId(prismaComment.id),
      new CommentBody(prismaComment.body),
      new UserId(prismaComment.authorId),
      new PostId(prismaComment.postId)
    );
    comment.setCreatedAt(new Date(prismaComment.createdAt));
    comment.setUpdatedAt(new Date(prismaComment.updatedAt));
    return comment;
  }

  async findCommentsByPostId(postId: PostId): Promise<Comment[]> {
    const prismaComments = await this.prisma.comment.findMany({
      where: {
        postId: postId.value,
      },
    })
    return prismaComments.map(this.toEntity)
  }
}
