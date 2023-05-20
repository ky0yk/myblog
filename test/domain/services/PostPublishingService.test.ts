import { Post } from "../../../src/domain/entities/Post"
import { IPostRepository } from "../../../src/domain/repositories/IPostRepository"
import { PostPublishingService } from "../../../src/domain/services/PostPublishingService"
import { Content } from "../../../src/domain/vo/Content"
import { PostId } from "../../../src/domain/vo/PostId"
import { Title } from "../../../src/domain/vo/Title"
import { UserId } from "../../../src/domain/vo/UserId"

describe('PostPublishingService', () => {
    const testPost = new Post(
        new PostId('id'),
        new Title('title'),
        new Content('content'),
        new UserId('userId'),
    );

    it("should publish a post", async () => {
        const mockPostRepo: IPostRepository = {
            findById: jest.fn().mockReturnValue(testPost),
            save: jest.fn().mockReturnValue(undefined),
            delete: jest.fn(),
        }

        const service = new PostPublishingService(mockPostRepo);
        await service.publish(new PostId("id"));

        expect(testPost.getIsPublished()).toBeTruthy();
        expect(mockPostRepo.save).toHaveBeenNthCalledWith(1, testPost);
    });

    it("should throw an error if the post does not exist", async () => {
        const mockPostRepo: IPostRepository = {
            findById: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn(),
        };

        const service = new PostPublishingService(mockPostRepo);

        await expect(service.publish(new PostId('id'))).rejects.toThrow('Post not found');
    });
});
