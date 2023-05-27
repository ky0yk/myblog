import { Request, Response } from 'express';
import { PostId } from '../../domain/vo/PostId';
// import { PostPublishingService } from '../../domain/services/PostPublishingService';

export class PostController {
    // private postPublishingService: PostPublishingService;

    // constructor(postPublishingService: PostPublishingService) {
    //     this.postPublishingService = postPublishingService;
    // }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    async createPost(req: Request, res: Response): Promise<void> {
        res.json({ message: "Post created" });
    }

    async getPost(req: Request, res: Response): Promise<void> {
        res.json({ message: "Single post retrieved", postId: req.params.postId });
    }

    async updatePost(req: Request, res: Response): Promise<void> {
        res.json({ message: "Post updated", postId: req.params.postId });
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        res.json({ message: "Post deleted", postId: req.params.postId });
    }

    async publishPost(req: Request, res: Response): Promise<void> {
        const postId: PostId = new PostId(req.params.postId);
        // await this.postPublishingService.publish(postId);
        res.json({ message: "Post published", postId: postId.value });
    }
}
