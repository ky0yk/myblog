import { Request, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { CommentService } from '../../../src/application/services/CommentService'
import { CommentController } from '../../../src/presentation/controller/CommentController'

let commentService: MockProxy<CommentService> & CommentService
let commentController: CommentController
let mockRequest: Partial<Request>
let mockResponse: Partial<Response>

beforeEach(() => {
  commentService = mock<CommentService>()
  commentController = new CommentController(commentService)
  mockRequest = {}
  mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  }
})

describe('CommentController', () => {
  describe('getCommentsByPostId', () => {
    it('should retrieve all comments for a post and return status 200', async () => {
      mockRequest.params = { postId: 'postId123' }
      await commentController.getCommentsByPostId(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle error when retrieving comments for a post', async () => {
      commentService.getCommentsByPostId.mockRejectedValue(new Error('Get comments error'))
      mockRequest.params = { postId: 'postId123' }

      await commentController.getCommentsByPostId(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Get comments error',
      })
    })
  })

  describe('getCommentById', () => {
    it('should retrieve a comment and return status 200', async () => {
      mockRequest.params = { id: 'commentId123' }
      await commentController.getCommentById(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle error when getting a comment', async () => {
      commentService.getCommentByCommentId.mockRejectedValue(new Error('Get comment error'))
      mockRequest.params = { id: 'commentId123' }

      await commentController.getCommentById(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Get comment error',
      })
    })
  })

  describe('createComment', () => {
    it('should create a comment and return status 201', async () => {
      mockRequest.body = {
        postId: 'postId123',
        content: 'Test Content',
        authorId: 'testAuthorId',
      }
      await commentController.createComment(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle error when creating a comment', async () => {
      commentService.createComment.mockRejectedValue(new Error('Create comment error'))
      mockRequest.body = {
        postId: 'postId123',
        content: 'Test Content',
        authorId: 'testAuthorId',
      }

      await commentController.createComment(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Create comment error',
      })
    })
  })

  describe('updateComment', () => {
    it('should update a comment and return status 200', async () => {
      mockRequest.params = { id: 'commentId123' }
      mockRequest.body = {
        postId: 'postId123',
        content: 'Updated Content',
        authorId: 'testAuthorId',
      }
      await commentController.updateComment(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle error when updating a comment', async () => {
      commentService.updateComment.mockRejectedValue(new Error('Update comment error'))
      mockRequest.params = { id: 'commentId123' }
      mockRequest.body = {
        postId: 'postId123',
        content: 'Updated Content',
        authorId: 'testAuthorId',
      }

      await commentController.updateComment(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Update comment error',
      })
    })
  })

  describe('deleteComment', () => {
    it('should delete a comment and return status 204', async () => {
      mockRequest.params = { id: 'commentId123' }
      await commentController.deleteComment(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should handle error when deleting a comment', async () => {
      commentService.deleteComment.mockRejectedValue(new Error('Delete comment error'))
      mockRequest.params = { id: 'commentId123' }

      await commentController.deleteComment(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Delete comment error',
      })
    })
  })
})
