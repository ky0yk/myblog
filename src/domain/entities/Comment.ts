import { CommentBody } from "../vo/CommentBody";
import { CommentId } from "../vo/CommentId";
import { PostId } from "../vo/PostId";
import { UserId } from "../vo/UserId";

export class Comment {
  private _id: CommentId;
  private _body: CommentBody;
  private _authorId: UserId;
  private _postId: PostId;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(
    id: CommentId,
    body: CommentBody,
    authorId: UserId,
    postId: PostId
  ) {
    this._id = id;
    this._body = body;
    this._authorId = authorId;
    this._postId = postId;
    // _createdAt and _updatedAt will be set when the instance is saved to the database.
  }

  // Getters
  get id(): CommentId {
    return this._id;
  }

  get body(): CommentBody {
    return this._body;
  }

  get authorId(): UserId {
    return this._authorId;
  }

  get postId(): PostId {
    return this._postId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  // Setters
  setCreatedAt(createdAt: Date): void {
    this._createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this._updatedAt = updatedAt;
  }
}
