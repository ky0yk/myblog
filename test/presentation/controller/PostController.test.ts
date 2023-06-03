import { Request, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { PostService } from '../../../src/application/services/PostService';
import { PostController } from '../../../src/presentation/controller/PostController';

let postService: MockProxy<PostService> & PostService;
let postController: PostController;
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;

beforeEach(() => {
  postService = mock<PostService>();
  postController = new PostController(postService);
  mockRequest = {};
  mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  };
});

describe('PostController', () => {
  describe('getAllPosts', () => {
    it('should retrieve all posts and return status 200', async () => {
      await postController.getAllPosts(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle error when retrieving all posts', async () => {
      postService.getAllPosts.mockRejectedValue(new Error('Get posts error'));

      await postController.getAllPosts(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get posts error' });
    });
  });

  describe('getPostById', () => {
    it('should retrieve a post and return status 200', async () => {
      mockRequest.params = { id: 'postId123' };
      await postController.getPostById(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle error when getting a post', async () => {
      postService.getPostById.mockRejectedValue(new Error('Get post error'));
      mockRequest.params = { id: 'postId123' };

      await postController.getPostById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get post error' });
    });
  });

  describe('createPost', () => {
    it('should create a post and return status 201', async () => {
      mockRequest.body = { title: 'Test Title', content: 'Test Content', authorId: 'testAuthorId' };
      await postController.createPost(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle error when creating a post', async () => {
      postService.createPost.mockRejectedValue(new Error('Create post error'));
      mockRequest.body = { title: 'Test Title', content: 'Test Content', authorId: 'testAuthorId' };

      await postController.createPost(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Create post error' });
    });
  });

  describe('updatePost', () => {
    it('should update a post and return status 200', async () => {
      mockRequest.params = { id: 'postId123' };
      mockRequest.body = { title: 'Updated Title', content: 'Updated Content', authorId: 'testAuthorId' };
      await postController.updatePost(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle error when updating a post', async () => {
      postService.updatePost.mockRejectedValue(new Error('Update post error'));
      mockRequest.params = { id: 'postId123' };
      mockRequest.body = { title: 'Updated Title', content: 'Updated Content', authorId: 'testAuthorId' };

      await postController.updatePost(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update post error' });
    });
  });

  describe('deletePost', () => {
    it('should delete a post and return status 204', async () => {
      mockRequest.params = { id: 'postId123' };
      await postController.deletePost(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should handle error when deleting a post', async () => {
      postService.deletePost.mockRejectedValue(new Error('Delete post error'));
      mockRequest.params = { id: 'postId123' };

      await postController.deletePost(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Delete post error' });
    });
  });

  describe('publishPost', () => {
    it('should publish a post and return status 204', async () => {
      mockRequest.params = { id: 'postId123' };
      await postController.publishPost(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should handle error when publishing a post', async () => {
      postService.publish.mockRejectedValue(new Error('Publish post error'));
      mockRequest.params = { id: 'postId123' };

      await postController.publishPost(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Publish post error' });
    });
  });
});
