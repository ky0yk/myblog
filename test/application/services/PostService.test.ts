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
  let post: Post;
  let prisma: PrismaClient;

  beforeEach(() => {
    postRepository = new PostRepository(prisma);
    postService = new PostService(postRepository);

    post = new Post(
      new PostId("someId"),
      new Title("Test Title"),
      new Content("Test Content"),
      new UserId("testAuthorId")
    );
  });

  describe("createPost", () => {
    it("should create a new post and return post details", async () => {
      const postCreateDto: PostCreateDto = {
        title: "Test Title",
        content: "Test Content",
        authorId: "testAuthorId"
      };
  
      const savedPost = new Post(
        new PostId('someId'),
        new Title(postCreateDto.title),
        new Content(postCreateDto.content),
        new UserId(postCreateDto.authorId)
      );
      savedPost.setCreatedAt(new Date());
      savedPost.setUpdatedAt(new Date());
  
      jest.spyOn(postRepository, "save").mockResolvedValue(savedPost);
  
      const result = await postService.createPost(postCreateDto);
  
      expect(result.id).toBe(savedPost.id.value);
      expect(result.authorId).toBe(savedPost.authorId.value);
      expect(result.title).toBe(savedPost.title.value);
      expect(result.content).toBe(savedPost.content.value);
      expect(result.isPublished).toBe(savedPost.isPublished);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
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
        createdAt: post.createdAt?.toISOString(),
        updatedAt: post.updatedAt?.toISOString()
      });
    });
  });

  describe("updatePost", () => {
    it("should update a post and return the updated post details", async () => {

        const postUpdateDto: PostUpdateDto = {
            title: "Updated Title",
            content: "Updated Content",
          };

        const updatedPost = new Post(
            post.id,
            new Title(postUpdateDto.title as string),
            new Content(postUpdateDto.content as string),
            post.authorId,
          );

      jest.spyOn(postRepository, "findById").mockResolvedValue(post);
      jest.spyOn(postRepository, "save").mockResolvedValue(updatedPost);

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
