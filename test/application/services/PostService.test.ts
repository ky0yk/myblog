import { PrismaClient } from "@prisma/client";
import { PostCreateDto } from "../../../src/application/dto/post/PostCreateDto";
import { PostUpdateDto } from "../../../src/application/dto/post/PostUpdateDto";
import { PostService } from "../../../src/application/services/PostService";
import { PostRepository } from "../../../src/infrastructure/repositories/PostRepository";
import { Post } from "../../../src/domain/entities/Post";
import { PostId } from "../../../src/domain/vo/PostId";
import { Title } from "../../../src/domain/vo/Title";
import { Content } from "../../../src/domain/vo/Content";
import { UserId } from "../../../src/domain/vo/UserId";

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

describe("PostService", () => {
  let postService: PostService;
  let postRepository: PostRepository;
  let postCreateDto: PostCreateDto;
  let postUpdateDto: PostUpdateDto;
  let post: Post;
  let prisma: PrismaClient;

  beforeEach(() => {
    postRepository = new PostRepository(prisma);
    postService = new PostService(postRepository);
    postCreateDto = {
      title: "Test Title",
      content: "Test Content",
      authorId: "testAuthorId"
    };
    postUpdateDto = {
      title: "Updated Title",
      content: "Updated Content",
    };
    post = new Post(
      new PostId("someId"),
      new Title(postCreateDto.title),
      new Content(postCreateDto.content),
      new UserId(postCreateDto.authorId)
    );
  });
  
  describe("createPost", () => {
    it("should create a new post and return post details", async () => {
      jest.spyOn(postRepository, "save").mockResolvedValue(post);

      const result = await postService.createPost(postCreateDto);
      
      expect(result).toEqual({
        id: post.id.value,
        authorId: post.authorId.value,
        title: post.title.value,
        content: post.content.value,
        isPublished: post.isPublished,
        createdAt: post.createdAt?.toISOString() ?? '',
        updatedAt: post.updatedAt?.toISOString() ?? ''
      });
    });
  });

  describe("getPostById", () => {
    it("should return post details if post exists", async () => {
      jest.spyOn(postRepository, "findById").mockResolvedValue(post);

      const result = await postService.getPostById(post.id);
      
      expect(result).toEqual({
        id: post.id.value,
        authorId: post.authorId.value,
        title: post.title.value,
        content: post.content.value,
        isPublished: post.isPublished,
        createdAt: post.createdAt?.toISOString() ?? '',
        updatedAt: post.updatedAt?.toISOString() ?? ''
      });
    });
  });

  describe("updatePost", () => {
    it("should update a post and return the updated post details", async () => {
      jest.spyOn(postRepository, "findById").mockResolvedValue(post);
      jest.spyOn(postRepository, "save").mockResolvedValue(post);

      const result = await postService.updatePost(post.id, postUpdateDto);

      expect(result.title).toBe(postUpdateDto.title);
      expect(result.content).toBe(postUpdateDto.content);
    });
  });

  describe("deletePost", () => {
    it("should delete a post", async () => {
      jest.spyOn(postRepository, "findById").mockResolvedValue(post);
      jest.spyOn(postRepository, "delete").mockResolvedValue();

      await postService.deletePost(post.id);

      expect(postRepository.delete).toHaveBeenCalledWith(post.id);
    });
  });
});
