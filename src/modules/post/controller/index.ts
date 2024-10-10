import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostServices } from 'src/modules/post/post.service';
import { Authorization, FindByPostIdDto, GetUser, IResponse } from 'src/shared';
import { AddCommentDto, CreatePostDto, GetCommentQueryDto, GetPostsQueryDto } from '../dto';
import { IAddComments, ICreatePost, IGetComments, IGetPosts } from '../type';
import { UserEntity } from 'src/modules/user/entity';

@Controller('posts')
export class PostController {
  constructor(private readonly services: PostServices) { }

  @Authorization(true)
  @Post('/')
  async createPost(
    @GetUser() user: UserEntity,
    @Body() body: CreatePostDto,
    @Res() res: Response,
  ) {
    const { id: userId } = user
    const payload: ICreatePost = {
      ...body,
      userId,
    };
    const response: IResponse = await this.services.createPost(payload);
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Get('/')
  async getPosts(
    @GetUser() user: UserEntity,
    @Query() query: GetPostsQueryDto,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const payload: IGetPosts = {
      ...query,
      userId,
    };
    const response: IResponse = await this.services.getPosts(payload);
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Get('/top/posts')
  async topPost(@Res() res: Response) {
    const response: IResponse = await this.services.topPost();
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Get('/:postId')
  async getSinglePost(@Param() params: FindByPostIdDto, @Res() res: Response) {
    const { postId } = params;
    const response: IResponse = await this.services.getSinglePost(postId);
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Get('/:postId/comments')
  async getPostComments(
    @Query() query: GetCommentQueryDto,
    @Param() params: FindByPostIdDto,
    @GetUser() user: UserEntity,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const { postId } = params;
    const payload: IGetComments = { ...query, postId, userId };
    console.log('--- here ---');
    const response: IResponse = await this.services.getPostComments(payload);
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Post('/:postId/comments')
  async addComment(
    @Body() body: AddCommentDto,
    @Param() params: FindByPostIdDto,
    @GetUser() user: UserEntity,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const { postId } = params;
    const payload: IAddComments = { ...body, postId, userId };
    const response: IResponse = await this.services.addComment(payload);
    return res.status(response.status).json(response);
  }
}
