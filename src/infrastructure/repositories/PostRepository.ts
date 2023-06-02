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

    return results.map(result => new Post(
      new PostId(result.id),
      new Title(result.title),
      new Content(result.content),
      new UserId(result.authorId),
    ))
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
      new UserId(result.authorId)
    )
  }

  async save(post: Post): Promise<void> {
    const { id, authorId, title, content } = post

    await this.prisma.post.upsert({
      where: { id: id.value },
      update: {
        authorId: authorId.value,
        title: title.value,
        content: content.value,
      },
      create: {
        id: id.value,
        authorId: authorId.value,
        title: title.value,
        content: content.value,
      },
    })
  }

  async delete(post: Post): Promise<void> {
    const { id } = post

    await this.prisma.post.delete({
      where: { id: id.value },
    })
  }
}
