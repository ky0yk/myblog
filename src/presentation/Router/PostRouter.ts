import express from 'express';
import { PostController } from '../Controller/PostController';

export class PostRouter {
    private postController: PostController;
    public router = express.Router();

    constructor(postController: PostController) {
        this.postController = postController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', (req, res) => this.postController.createPost(req, res));
        this.router.get('/:postId', (req, res) => this.postController.getPost(req, res));
        this.router.put('/:postId', (req, res) => this.postController.updatePost(req, res));
        this.router.delete('/:postId', (req, res) => this.postController.deletePost(req, res));
        this.router.post('/:postId/publish', (req, res) => this.postController.publishPost(req, res));
    }
}
