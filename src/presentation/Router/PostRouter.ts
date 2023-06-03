import express from 'express';
import { PostController } from '../controller/PostController';

export class PostRouter {
  private postController: PostController;
  public router = express.Router();

  constructor(postController: PostController) {
    this.postController = postController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', (req, res) => this.postController.getAllPosts(req, res));
    this.router.get('/:id', (req, res) => this.postController.getPostById(req, res));
    this.router.post('/', (req, res) => this.postController.createPost(req, res));
    this.router.put('/:id', (req, res) => this.postController.updatePost(req, res));
    this.router.delete('/:id', (req, res) => this.postController.deletePost(req, res));
    this.router.post('/:id/publish', (req, res) => this.postController.publishPost(req, res));
  }
}
