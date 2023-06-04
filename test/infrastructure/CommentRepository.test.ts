import { PrismaClient } from "@prisma/client";
import { Comment } from '../../src/domain/entities/Comment';
import { CommentRepository } from '../../src/infrastructure/repositories/CommentRepository';
import { CommentId } from "../../src/domain/vo/CommentId";
import { CommentBody } from "../../src/domain/vo/CommentBody";
import { UserId } from "../../src/domain/vo/UserId";
import { PostId } from "../../src/domain/vo/PostId";


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        comment: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
          upsert: jest.fn(),
          delete: jest.fn(),
        },
      };
    }),
  };
});

describe('CommentRepository', () => {
  let commentRepository: CommentRepository;
  let prisma: PrismaClient;
  let timestamp: Date;
  let comment: Comment;

  beforeEach(() => {
    prisma = new PrismaClient();
    commentRepository = new CommentRepository(prisma);
    timestamp = new Date();
    comment = new Comment(
      new CommentId('testCommentId'),
      new CommentBody('test body'),
      new UserId('testAuthorId'),
      new PostId('testPostId'),
    );
    comment.setCreatedAt(timestamp);
    comment.setUpdatedAt(timestamp);
  });

  describe('findAllByPostId', () => {
    it('should return all comments by post ID', async () => {
      jest.spyOn(prisma.comment, 'findMany').mockResolvedValue([{
        id: comment.id.value,
        authorId: comment.authorId.value,
        body: comment.body.value,
        postId: comment.postId.value,
        createdAt: timestamp,
        updatedAt: timestamp,
      }]);

      const comments = await commentRepository.findAllByPostId(comment.postId);

      expect(comments).toEqual([comment]);
    });
  });

  describe('findById', () => {
    it('should return the comment if it exists', async () => {
      jest.spyOn(prisma.comment, 'findUnique').mockResolvedValue({
        id: comment.id.value,
        authorId: comment.authorId.value,
        body: comment.body.value,
        postId: comment.postId.value,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const foundComment = await commentRepository.findById(comment.id);

      expect(foundComment).toEqual(comment);
    });

    it('should return null if the comment does not exist', async () => {
      jest.spyOn(prisma.comment, 'findUnique').mockResolvedValue(null);

      const foundComment = await commentRepository.findById(new CommentId('nonexistentId'));

      expect(foundComment).toBeNull();
    });
  });

  describe('save', () => {
    it('should save the comment and return it', async () => {
      jest.spyOn(prisma.comment, 'upsert').mockResolvedValue({
        id: comment.id.value,
        authorId: comment.authorId.value,
        body: comment.body.value,
        postId: comment.postId.value,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const savedComment = await commentRepository.save(comment);

      expect(savedComment).toEqual(comment);
    });
  });

  describe('delete', () => {
    it('should delete the comment', async () => {
      const mockDelete = jest.spyOn(prisma.comment, 'delete');

      await commentRepository.delete(comment.id);

      expect(mockDelete).toHaveBeenCalledWith({ where: { id: comment.id.value } });
    });
  });
});
