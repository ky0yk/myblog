const mockedFindUnique = jest.fn()
const mockedUpsert = jest.fn()
const mockedDelete = jest.fn()

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        post: {
          findUnique: mockedFindUnique,
          upsert: mockedUpsert,
          delete: mockedDelete,
        },
      }
    }),
  }
})

import { PrismaClient } from '@prisma/client'
import { PostId } from '../../src/domain/vo/PostId'
import { UserId } from '../../src/domain/vo/UserId'
import { Title } from '../../src/domain/vo/Title'
import { Content } from '../../src/domain/vo/Content'
import { Post } from '../../src/domain/entities/Post'
import { PostRepository } from '../../src/infrastructure/repositories/PostRepository'

let postRepository: PostRepository
const prisma = new PrismaClient()

const testPostData = {
  id: new PostId('someId'),
  authorId: new UserId('authorId'),
  title: new Title('Test Title'),
  content: new Content('Test content'),
}

const postEntity = new Post(
  testPostData.id,
  testPostData.title,
  testPostData.content,
  testPostData.authorId
)

const mockPost = {
  id: testPostData.id.value,
  authorId: testPostData.authorId.value,
  title: testPostData.title.value,
  content: testPostData.content.value,
  isPublished: postEntity.isPublished,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

beforeEach(() => {
  postRepository = new PostRepository(prisma)
})

describe('PostRepository', () => {
  describe('findById', () => {
    it('should return the expected post when post exists', async () => {
      mockedFindUnique.mockResolvedValue(mockPost)
      const result = await postRepository.findById(testPostData.id)
      expect(result).toEqual(postEntity)
    })

    it('should return null when post does not exist', async () => {
      mockedFindUnique.mockResolvedValue(null)
      const result = await postRepository.findById(testPostData.id)
      expect(result).toBeNull()
    })

    it('should throw error when findUnique throws error', async () => {
      mockedFindUnique.mockRejectedValue(new Error('Test error'))
      await expect(postRepository.findById(testPostData.id)).rejects.toThrow(
        'Test error'
      )
    })
  })

  describe('save', () => {
    it('should save the post without throwing an error', async () => {
      mockedUpsert.mockResolvedValue(null)
      await expect(postRepository.save(postEntity)).resolves.not.toThrow()
    })

    it('should throw error when upsert throws error', async () => {
      mockedUpsert.mockRejectedValue(new Error('Test error'))
      await expect(postRepository.save(postEntity)).rejects.toThrow(
        'Test error'
      )
    })
  })

  // describe('delete', () => {
  //   it('should delete the post without throwing an error', async () => {
  //     mockedDelete.mockResolvedValue(null)
  //     await expect(postRepository.delete(postEntity)).resolves.not.toThrow()
  //   })

  //   it('should throw error when delete throws error', async () => {
  //     mockedDelete.mockRejectedValue(new Error('Test error'))
  //     await expect(postRepository.delete(postEntity)).rejects.toThrow(
  //       'Test error'
  //     )
  //   })
  // })
})
