import { Request, Response } from 'express'
import { PostService } from '../../application/services/PostService'
import { PostId } from '../../domain/vo/PostId'
import { PostCreateDto } from '../../application/dto/post/PostCreateDto'
import { PostUpdateDto } from '../../application/dto/post/PostUpdateDto'

export class PostController {
  constructor(private postService: PostService) {}

  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.postService.getAllPosts()
      res.json(posts)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const id = new PostId(req.params.id)
      const post = await this.postService.getPostById(id)
      res.json(post)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const postDto = req.body as PostCreateDto
      const post = await this.postService.createPost(postDto)
      res.status(201).json(post)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const id = new PostId(req.params.id)
      const postDto = req.body as PostUpdateDto
      const post = await this.postService.updatePost(id, postDto)
      res.json(post)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const id = new PostId(req.params.id)
      await this.postService.deletePost(id)
      res.sendStatus(204)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async publishPost(req: Request, res: Response): Promise<void> {
    try {
      const id = new PostId(req.params.id)
      await this.postService.publish(id)
      res.sendStatus(204)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }
}
