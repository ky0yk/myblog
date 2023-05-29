import { Request, Response } from 'express';

import { AuthController } from '../../src/presentation/controller/AuthController';
import { AuthService } from '../../src/application/AuthService';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../src/infrastructure/repositories/UserRepository';

jest.mock('../../src/application/AuthService');

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let statusSpy: jest.SpyInstance;
    let jsonSpy: jest.SpyInstance;
    let prisma: PrismaClient
    let userRepository: UserRepository

    beforeEach(() => {
        prisma = new PrismaClient();
        userRepository = new UserRepository(prisma);
        authService = new AuthService(userRepository);
        authController = new AuthController(authService);
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        statusSpy = jest.spyOn(mockResponse, 'status');
        jsonSpy = jest.spyOn(mockResponse, 'json');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns a token if login is successful', async () => {
        const testToken = 'testToken';
        const testEmail = 'test@example.com';
        const testPassword = 'password';

        (authService.login as jest.Mock).mockResolvedValue(testToken);

        mockRequest.body = {
            email: testEmail,
            password: testPassword,
        };

        await authController.login(mockRequest as Request, mockResponse as Response);

        expect(jsonSpy).toHaveBeenCalledWith({ token: testToken });
    });

    it('returns 401 if login is unsuccessful', async () => {
        const testEmail = 'test@example.com';
        const testPassword = 'password';

        (authService.login as jest.Mock).mockResolvedValue(null);

        mockRequest.body = {
            email: testEmail,
            password: testPassword,
        };

        await authController.login(mockRequest as Request, mockResponse as Response);

        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({ message: 'Invalid email or password'});
    });

    it('returns 400 and error message if error is thrown', async () => {
        const testError = new Error('test error');

        (authService.login as jest.Mock).mockRejectedValue(testError);

        mockRequest.body = {
            email: 'invalidEmail@example.com',
            password: 'invalidPassword',
        };

        await authController.login(mockRequest as Request, mockResponse as Response);

        expect(statusSpy).toHaveBeenCalledWith(400);
        expect(jsonSpy).toHaveBeenCalledWith({ error: testError.message });
    });
});
