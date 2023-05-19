import { Comment } from "../../../src/domain/entities/Comment";
import { CommentBody } from "../../../src/domain/vo/CommentBody";
import { CommentId } from "../../../src/domain/vo/CommentId";
import { PostId } from "../../../src/domain/vo/PostId";
import { UserId } from "../../../src/domain/vo/UserId";


describe('Comment', () => {
  it('should create a comment successfully', () => {
    const comment = new Comment(
      new CommentId('1'),
      new CommentBody('Test Comment Body'),
      new UserId('2'),
      new PostId('3'),
    );

    expect(comment.getId().getValue()).toEqual('1');
    expect(comment.getBody().getValue()).toEqual('Test Comment Body');
    expect(comment.getAuthorId().getValue()).toEqual('2');
    expect(comment.getPostId().getValue()).toEqual('3');
  });

  // Add more tests for other methods and error cases
});
