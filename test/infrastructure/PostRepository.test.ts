jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        post: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
          upsert: jest.fn(),
          delete: jest.fn(),
        },
      }
    }),
  }
})


import { PrismaClient } from '@prisma/client'
import { PostId } from '../../src/domain/vo/PostId'
import { UserId } from '../../src/domain/vo/UserId'
import { Title } from '../../src/domain/vo/Title'
import { Content } from '../../src/domain/vo/Content'
import { Post } from '../../src/domain/entities/Post'
import { PostRepository } from '../../src/infrastructure/repositories/PostRepository'

describe("PostRepository", () => {
  let postRepository: PostRepository;
  let prisma: PrismaClient;
  let timestamp: Date
  let post: Post;

  beforeEach(() => {
    prisma = new PrismaClient();
    postRepository = new PostRepository(prisma);
    timestamp = new Date();
    post = new Post(
      new PostId("someId"),
      new Title("Test Title"),
      new Content("Test Content"),
      new UserId("testAuthorId"),
      false,
      timestamp,
      timestamp,
    );
  });

  describe("findAll", () => {
    it("should return all posts", async () => {
      jest.spyOn(prisma.post, "findMany").mockResolvedValue([{
        id: post.id.value,
        authorId: post.authorId.value,
        title: post.title.value,
        content: post.content.value,
        isPublished: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      }]);

      const posts = await postRepository.findAll();

      expect(posts).toEqual([post]);
    });
  });

  describe("findById", () => {
    it("should return the post if it exists", async () => {
      jest.spyOn(prisma.post, "findUnique").mockResolvedValue({
        id: post.id.value,
        authorId: post.authorId.value,
        title: post.title.value,
        content: post.content.value,
        isPublished: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const foundPost = await postRepository.findById(post.id);

      expect(foundPost).toEqual(post);
    });

    it("should return null if the post does not exist", async () => {
      jest.spyOn(prisma.post, "findUnique").mockResolvedValue(null);

      const foundPost = await postRepository.findById(new PostId("nonexistentId"));

      expect(foundPost).toBeNull();
    });
  });

  describe("save", () => {
    it("should save the post and return it", async () => {
      jest.spyOn(prisma.post, "upsert").mockResolvedValue({
        id: post.id.value,
        authorId: post.authorId.value,
        title: post.title.value,
        content: post.content.value,
        isPublished: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const savedPost = await postRepository.save(post);

      expect(savedPost).toEqual(post);
    });
  });

  describe("delete", () => {
    it("should delete the post", async () => {
      const mockDelete = jest.spyOn(prisma.post, "delete");

      await postRepository.delete(post.id);

      expect(mockDelete).toHaveBeenCalledWith({ where: { id: post.id.value } });
    });
  });
});
