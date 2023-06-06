export interface CommentResponseDto {
    id: string;
    body: string;
    authorId: string;
    authorName: string;
    postId: string;
    createdAt?: string;
    updatedAt?: string;
  }
