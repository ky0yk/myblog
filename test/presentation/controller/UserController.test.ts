import { Request, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { UserService } from '../../../src/application/services/UserService'
import { AuthService } from '../../../src/application/services/AuthService'
import { UserController } from '../../../src/presentation/controller/UserController'

let userService: MockProxy<UserService> & UserService
let authService: MockProxy<AuthService> & AuthService
let userController: UserController
let mockRequest: Partial<Request>
let mockResponse: Partial<Response>

beforeEach(() => {
  userService = mock<UserService>()
  authService = mock<AuthService>()
  userController = new UserController(userService, authService)
  mockRequest = {}
  mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  }
})

describe('UserController', () => {
  describe('register', () => {
    it('should register a user and return status 201', async () => {
      mockRequest.body = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'myPassword',
      }
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should handle error when registering a user', async () => {
      userService.register.mockRejectedValue(new Error('Register error'))
      mockRequest.body = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'myPassword',
      }

      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Register error',
      })
    })
  })
})

describe('getUser', () => {
  it('should retrieve a user and return status 200', async () => {
    mockRequest.params = { userId: 'userId123' }
    await userController.getUser(
      mockRequest as Request,
      mockResponse as Response
    )
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it('should handle error when getting a user', async () => {
    userService.get.mockRejectedValue(new Error('Get user error'))
    mockRequest.params = { userId: 'userId123' }

    await userController.getUser(
      mockRequest as Request,
      mockResponse as Response
    )

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get user error' })
  })
})

describe('updateUser', () => {
  it('should update a user and return status 200', async () => {
    mockRequest.params = { userId: 'userId123' }
    mockRequest.body = {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'newPassword',
    }
    await userController.updateUser(
      mockRequest as Request,
      mockResponse as Response
    )
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it('should handle error when updating a user', async () => {
    userService.update.mockRejectedValue(new Error('Update user error'))
    mockRequest.params = { userId: 'userId123' }
    mockRequest.body = {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'newPassword',
    }

    await userController.updateUser(
      mockRequest as Request,
      mockResponse as Response
    )

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Update user error',
    })
  })
})

describe('deleteUser', () => {
  it('should delete a user and return status 204', async () => {
    mockRequest.params = { userId: 'userId123' }
    await userController.deleteUser(
      mockRequest as Request,
      mockResponse as Response
    )
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should handle error when deleting a user', async () => {
    userService.delete.mockRejectedValue(new Error('Delete user error'))
    mockRequest.params = { userId: 'userId123' }

    await userController.deleteUser(
      mockRequest as Request,
      mockResponse as Response
    )

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Delete user error',
    })
  })
})

describe('login', () => {
  it('should login a user and return status 200', async () => {
    mockRequest.body = { email: 'alice@example.com', password: 'myPassword' }
    await userController.login(mockRequest as Request, mockResponse as Response)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it('should handle error when logging in', async () => {
    authService.login.mockRejectedValue(new Error('Login error'))
    mockRequest.body = { email: 'alice@example.com', password: 'myPassword' }

    await userController.login(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Login error' })
  })
})
