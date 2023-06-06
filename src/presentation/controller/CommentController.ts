import { Request, Response } from 'express';
import { CommentService } from '../../application/services/CommentService';
import { PostId } from '../../domain/vo/PostId';
import { CommentId } from '../../domain/vo/CommentId';
import { CommentCreateDto } from '../../application/dto/comment/CommentCreateDto';
import { CommentUpdateDto } from '../../application/dto/comment/CommentUpdateDto';

export class CommentController {
  constructor(private commentService: CommentService) {}

  async getCommentsByPostId(req: Request, res: Response): Promise<void> {
    try {
      const postId = new PostId(req.params.postId)
      const comments = await this.commentService.getCommentsByPostId(postId)
      res.json(comments)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const id = new CommentId(req.params.id)
      const comment = await this.commentService.getCommentByCommentId(id)
      res.json(comment)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const commentDto = req.body as CommentCreateDto
      const comment = await this.commentService.createComment(commentDto)
      res.status(201).json(comment)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const id = new CommentId(req.params.id)
      const commentDto = req.body as CommentUpdateDto
      const comment = await this.commentService.updateComment(id, commentDto)
      res.json(comment)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const id = new CommentId(req.params.id)
      await this.commentService.deleteComment(id)
      res.sendStatus(204)
    } catch (err) {
      res
        .status(400)
        .json({ error: err instanceof Error ? err.message : String(err) })
    }
  }
}
