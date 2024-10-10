import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PostFactoryServices } from './post-factory.service';
import { DataSource } from 'typeorm';
import { IDatabaseServices } from '../database';
import { ResponseUtilsService } from '../utils';
import { IAddComments, ICreatePost, IGetComments, IGetPosts } from './type';
import * as _ from 'lodash'
@Injectable()
export class PostServices implements OnApplicationShutdown {

  private readonly postSelectFields = [
    'id',
    'title',
    'content',
    'createdAt'
  ]
  private readonly commentSelectField = [
    'id',
    'comment',
    'createdAt'
  ]
  constructor(
    private readonly data: IDatabaseServices,
    private readonly postFactory: PostFactoryServices,
    private readonly response: ResponseUtilsService,
    private readonly connection: DataSource,
  ) { }
  async onApplicationShutdown(signal: string) {
    console.log('signal', signal);
    this.connection.destroy();
  }

  async createPost(payload: ICreatePost) {
    const factory = await this.postFactory.cleanPost({
      ...payload,
    });
    await this.data.posts.create(factory);

    return this.response.success201Response({
      message: 'Created successfully',
      data: {},
    });

  }
  async addComment(payload: IAddComments) {
    const { postId, userId, comment } = payload;
    const post = await this.data.posts.findOne({ id: postId });
    if (!post) {
      return this.response.error404Response('Post does not exists');
    }

    const factory = await this.postFactory.cleanComment({
      postId,
      userId,
      comment
    });
    await this.data.comments.create(factory);

    return this.response.success201Response({
      message: 'Created successfully',
      data: {},
    });

  }

  async topPost() {
    const query = `WITH latest_comments AS (
        SELECT posts."userId", posts.id AS postId, MAX(comments."createdAt") AS latestCommentTime
        FROM posts
        LEFT JOIN comments ON posts.id = comments."postId"
        GROUP BY posts."userId", posts.id
    ),
    user_posts_count AS (
        SELECT posts."userId", COUNT(*) AS postCount
        FROM posts
        GROUP BY posts."userId"
    ),
    ranked_users AS (
        SELECT u.id, u."fullName", p.title, c.comment, uc.postCount,
               ROW_NUMBER() OVER (ORDER BY uc.postCount DESC) AS rank
        FROM users u
        JOIN posts p ON u.id = p."userId"
        JOIN latest_comments lc ON p.id = lc.postId
        JOIN comments c ON lc.postId = c."postId" AND lc.latestCommentTime = c."createdAt"
        JOIN user_posts_count uc ON u.id = uc."userId"
    )
    SELECT id, "fullName", title, "comment"
    FROM ranked_users
    WHERE rank <= 3;`;
    const data = await this.data.posts.runQuery(query);
    return this.response.success200Response({
      message: 'Retrieved successfully',
      data,
    });

  }
  async getPosts(payload: IGetPosts) {
    const filterQuery = this.postFactory.cleanPostQuery(payload);
    const { data, pagination } = await this.data.posts.findAllWithPagination(
      filterQuery,
      { selectFields: this.postSelectFields },
    );
    const cleaned = data.map((_post) => ({
      ..._.omit(_post, ['comments']),
      user: {
        fullName: _post?.user?.fullName
      }
    }))
    return this.response.success200Response({
      message: 'Retrieved successfully',
      data: cleaned,
      pagination,
    });

  }

  async getSinglePost(postId: string) {
    const data = await this.data.posts.findOne({ id: postId });
    if (!data) {
      return this.response.error404Response('Post does not exists');
    }
    return this.response.success200Response({
      message: 'Retrieved successfully',
      data,
    });

  }

  async getPostComments(payload: IGetComments) {
    const filterQuery = this.postFactory.cleanCommentQuery(payload);

    const { data, pagination } =
      await this.data.comments.findAllWithPagination(filterQuery, { selectFields: this.commentSelectField });

    const cleaned = data.map((_comment) => ({
      ..._comment,
      user: {
        fullName: _comment?.user?.fullName
      }

    }))
    return this.response.success200Response({
      message: 'Retrieved successfully',
      data: cleaned,
      pagination,
    });

  }
}
