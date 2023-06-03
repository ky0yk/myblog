import { Name } from './Name';
import { PostId } from './PostId';
import { Title } from './Title';

export class PostSummary {
  private _id: PostId;
  private _title: Title;
  private _shortContent: string;
  private _authorName: Name;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: PostId,
    title: Title,
    shortContent: string,
    authorName: Name,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id;
    this._title = title;
    this._shortContent = shortContent;
    this._authorName = authorName;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // getters
  get id(): PostId {
    return this._id;
  }

  get title(): Title {
    return this._title;
  }

  get shortContent(): string {
    return this._shortContent;
  }

  get authorName(): Name {
    return this._authorName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
