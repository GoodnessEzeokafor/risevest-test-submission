import { UserEntity } from "src/modules/user/entity";
import { BaseEntity } from "src/shared";


export class PostEntity extends BaseEntity {
  id: string;
  title: string;
  content: string;
  userId: string
  user?: UserEntity
}


export class CommentEntity extends BaseEntity {
  comment: string;
  userId: string
  postId: string
  user?: UserEntity
  post?: PostEntity
}
