import { PrismaClient } from "@prisma/client";
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

    return results.map(result => this.toEntitiy(result));
  }

  async findById(id: CommentId): Promise<Comment | null> {
    const result = await this.prisma.comment.findUnique({
      where: { id: id.value },
    });

    if (result == null) {
      return null;
    }

    return this.toEntitiy(result);
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

    return this.toEntitiy(savedRecord);
  }

  async delete(id: CommentId): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: id.value },
    });
  }

  private toEntitiy(commentRecord: any): Comment {
    const comment = new Comment(
      new CommentId(commentRecord.id),
      new CommentBody(commentRecord.body),
      new UserId(commentRecord.authorId),
      new PostId(commentRecord.postId)
    );
    comment.setCreatedAt(new Date(commentRecord.createdAt));
    comment.setUpdatedAt(new Date(commentRecord.updatedAt));
    return comment;
  }
}
