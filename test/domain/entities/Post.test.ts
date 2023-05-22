import { Post } from "../../../src/domain/entities/Post";
import { Content } from "../../../src/domain/vo/Content";
import { PostId } from "../../../src/domain/vo/PostId";
import { Title } from "../../../src/domain/vo/Title";
import { UserId } from "../../../src/domain/vo/UserId";

describe('Post', () => {
  it('should create a post successfully', () => {
    const post = new Post(
      new PostId('1'),
      new Title('Test Title'),
      new Content('Test Content'),
      new UserId('1'),
    );

    expect(post.id.value).toEqual('1');
    expect(post.title.value).toEqual('Test Title');
    expect(post.content.value).toEqual('Test Content');
    expect(post.authorId.value).toEqual('1');
  });

  // Add more tests for other methods and error cases
});
