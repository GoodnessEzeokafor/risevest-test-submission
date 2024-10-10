import { Injectable } from '@nestjs/common';
import { CommentEntity, PostEntity } from './entity';
import { IGetComments, IGetPosts } from './type';

@Injectable()
export class PostFactoryServices {

  cleanPost(data: Partial<PostEntity>) {
    const {
      title,
      content,
      userId,

    } = data;
    const post = {
      ...(userId && { userId }),
      ...(title && { title }),
      ...(content && { content }),
    };

    return post;
  }

  cleanComment(data: Partial<CommentEntity>) {
    const {
      comment,
      userId,
      postId,
    } = data;
    const saved = {
      ...(comment && { comment }),
      ...(userId && { userId }),
      ...(postId && { postId }),
    };
    return saved;
  }

  cleanPostQuery(data: IGetPosts) {
    const {
      perPage,
      page,
      sort,
      q,
      userId,
      id
    } = data;
    const key = {
      ...(userId && { userId }),
      ...(id && { id }),
      ...(perPage && { perPage }),
      ...(page && { page }),
      ...(sort && { sort }),
      ...(q && { q }),
    };
    return key;

  }
  cleanCommentQuery(data: IGetComments) {
    const {
      perPage,
      page,
      sort,
      q,
      userId,
      postId
    } = data;
    const key = {
      ...(userId && { userId }),
      ...(postId && { postId }),
      ...(perPage && { perPage }),
      ...(page && { page }),
      ...(sort && { sort }),
      ...(q && { q }),
    };
    return key;
  }

}
