import { PrismaClient } from "@prisma/client";
import { CommentService } from "../../../src/application/services/CommentService";
import { CommentRepository } from "../../../src/infrastructure/repositories/CommentRepository";
import { UserRepository } from "../../../src/infrastructure/repositories/UserRepository";
import { CommentId } from "../../../src/domain/vo/CommentId";
import { CommentBody } from "../../../src/domain/vo/CommentBody";
import { UserId } from "../../../src/domain/vo/UserId";
import { PostId } from "../../../src/domain/vo/PostId";
import { User } from "../../../src/domain/entities/User";
import { Name } from "../../../src/domain/vo/Name";
import { Email } from "../../../src/domain/vo/Email";
import { Password } from "../../../src/domain/vo/Password";
import { Comment } from "../../../src/domain/entities/Comment";
import { CommentCreateDto } from "../../../src/application/dto/comment/CommentCreateDto";
import { CommentUpdateDto } from "../../../src/application/dto/comment/CommentUpdateDto";


jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn().mockImplementation(() => {
        return {
          post: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
          },
        }
      }),
    }
  })

describe('CommentService', () => {
  let prisma: PrismaClient;
  let commentService: CommentService;
  let commentRepository: CommentRepository;
  let userRepository: UserRepository;
  let comment: Comment;
  let user: User;

  beforeEach(() => {
    commentRepository = new CommentRepository(prisma);
    userRepository = new UserRepository(prisma);
    commentService = new CommentService(commentRepository, userRepository);

    comment = new Comment(
      new CommentId('someId'),
      new CommentBody('Test Comment'),
      new UserId('testAuthorId'),
      new PostId('testPostId')
    );

    user = new User(
      new UserId('testAuthorId'),
      new Name('Test User'),
      new Email('test@example.com'),
      new Password('password')
    );
  });

  describe('getCommentsByPostId', () => {
    it('should return comments with author names for given post id', async () => {
      jest.spyOn(commentRepository, 'findCommentsByPostId').mockResolvedValue([comment]);
      jest.spyOn(userRepository, 'findUsersByIds').mockResolvedValue([user]);

      const result = await commentService.getCommentsByPostId(comment.postId);

      expect(result).toEqual([{
        id: comment.id.value,
        body: comment.body.value,
        authorId: comment.authorId.value,
        authorName: user.name.value,
        postId: comment.postId.value,
        createdAt: comment.createdAt?.toISOString(),
        updatedAt: comment.updatedAt?.toISOString(),
      }]);
    });
  });

  describe('getCommentByCommentId', () => {
    it('should return a comment for the given comment id', async () => {
      jest.spyOn(commentRepository, 'findById').mockResolvedValue(comment);
      jest.spyOn(userRepository, 'find').mockResolvedValue(user);

      const result = await commentService.getCommentByCommentId(comment.id);

      expect(result).toEqual({
        id: comment.id.value,
        body: comment.body.value,
        authorId: comment.authorId.value,
        authorName: user.name.value,
        postId: comment.postId.value,
        createdAt: comment.createdAt?.toISOString(),
        updatedAt: comment.updatedAt?.toISOString(),
      });
    });
  });

  describe('createComment', () => {
    it('should create a comment and return it', async () => {
      const commentCreateDto: CommentCreateDto = {
        body: 'Test Comment',
        authorId: 'testAuthorId',
        postId: 'testPostId'
      };

      jest.spyOn(commentRepository, 'save').mockResolvedValue(comment);
      jest.spyOn(userRepository, 'find').mockResolvedValue(user);

      const result = await commentService.createComment(commentCreateDto);

      expect(result).toEqual({
        id: comment.id.value,
        body: comment.body.value,
        authorId: comment.authorId.value,
        authorName: user.name.value,
        postId: comment.postId.value,
        createdAt: comment.createdAt?.toISOString(),
        updatedAt: comment.updatedAt?.toISOString(),
      });
    });
  });

  describe('updateComment', () => {
    it('should update a comment and return it', async () => {
      const commentUpdateDto: CommentUpdateDto = {
        body: 'Updated Comment',
      };

      const updatedComment = new Comment(
        comment.id,
        new CommentBody(commentUpdateDto.body as string),
        comment.authorId,
        comment.postId
      );

      jest.spyOn(commentRepository, 'findById').mockResolvedValue(comment);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(updatedComment);
      jest.spyOn(userRepository, 'find').mockResolvedValue(user);

      const result = await commentService.updateComment(comment.id, commentUpdateDto);

      expect(result).toEqual({
        id: updatedComment.id.value,
        body: updatedComment.body.value,
        authorId: updatedComment.authorId.value,
        authorName: user.name.value,
        postId: updatedComment.postId.value,
        createdAt: updatedComment.createdAt?.toISOString(),
        updatedAt: updatedComment.updatedAt?.toISOString(),
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      jest.spyOn(commentRepository, 'findById').mockResolvedValue(comment);
      jest.spyOn(commentRepository, 'delete').mockResolvedValue();

      await commentService.deleteComment(comment.id);

      expect(commentRepository.delete).toHaveBeenCalledWith(comment.id);
    });
  });
});
