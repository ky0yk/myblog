import { PrismaClient } from '@prisma/client'
import { Post } from '../../domain/entities/Post'
import { IPostRepository } from '../../domain/repositories/IPostRepository'
import { PostId } from '../../domain/vo/PostId'
import { Title } from '../../domain/vo/Title'
import { Content } from '../../domain/vo/Content'
import { UserId } from '../../domain/vo/UserId'

export class PostRepository implements IPostRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async findAll(): Promise<Post[]> {
    const results = await this.prisma.post.findMany()

    return results.map(
      (result) =>
        new Post(
          new PostId(result.id),
          new Title(result.title),
          new Content(result.content),
          new UserId(result.authorId),
          result.isPublished,
          new Date(result.createdAt),
          new Date(result.updatedAt)
        )
    )
  }

  async findById(id: PostId): Promise<Post | null> {
    const result = await this.prisma.post.findUnique({
      where: { id: id.value },
    })

    if (result == null) {
      return null
    }

    return new Post(
      new PostId(result.id),
      new Title(result.title),
      new Content(result.content),
      new UserId(result.authorId),
      result.isPublished,
      new Date(result.createdAt),
      new Date(result.updatedAt)
    )
  }

  async save(post: Post): Promise<Post> {
    const { id, authorId, title, content, isPublished } = post

    const savedPost = await this.prisma.post.upsert({
      where: { id: id.value },
      update: {
        authorId: authorId.value,
        title: title.value,
        content: content.value,
        isPublished: isPublished,
        updatedAt: new Date(),
      },
      create: {
        id: id.value,
        authorId: authorId.value,
        title: title.value,
        content: content.value,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return new Post(
      new PostId(savedPost.id),
      new Title(savedPost.title),
      new Content(savedPost.content),
      new UserId(savedPost.authorId),
      savedPost.isPublished,
      new Date(savedPost.createdAt),
      new Date(savedPost.updatedAt)
    )
  }

  async delete(postId: PostId): Promise<void> {
    await this.prisma.post.delete({
      where: { id: postId.value },
    })
  }
}
