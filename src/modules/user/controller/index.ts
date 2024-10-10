import { UserServices } from 'src/modules/user/user.service';
import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PostServices } from 'src/modules/post';
import { ICreateUser, IGetUsers, ILoginUser } from '../type';
import { CreateUserDto, GetUsersQueryDto, LoginUserDto } from '../dto';
import { Authorization, FindByIdDto, GetUser, IResponse } from 'src/shared';
import { CreatePostDto, GetPostsQueryDto } from 'src/modules/post/dto';
import { UserEntity } from '../entity';
import { ICreatePost } from 'src/modules/post/type';


@Controller('users')
export class UserController {
  constructor(
    private readonly services: UserServices,
    private readonly postServices: PostServices,
  ) { }

  @Post('/')
  async createUser(@Res() res: Response, @Body() body: CreateUserDto) {
    const payload: ICreateUser = {
      ...body,
    };
    const response: IResponse = await this.services.createUser(payload);
    return res.status(response.status).json(response);
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() body: LoginUserDto) {
    const payload: ILoginUser = {
      ...body,
    };
    const response: IResponse = await this.services.login(payload);
    return res.status(response.status).json(response);
  }

  @Get('/')
  async getUsers(@Query() query: GetUsersQueryDto, @Res() res: Response) {
    const payload: IGetUsers = {
      ...query,
    };
    const response: IResponse = await this.services.getUsers(payload);
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Get('/auth')
  async getAuthUser(@Req() req: Request, @Res() res: Response) {
    const { id, email, firstName, lastName } = req.user;
    const response: IResponse = await this.services.getAuthUser({
      id,
      email,
      firstName,
      lastName,
    });
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Get('/:id/posts')
  async getUserPosts(
    @Query() query: GetPostsQueryDto,
    @Param() params: FindByIdDto, // ignoring this, its more safer to get the user's id from the auth middleware/guard
    @Res() res: Response,
  ) {
    const { id: userId } = params;
    const response: IResponse = await this.postServices.getPosts({
      ...query,
      userId,
    });
    return res.status(response.status).json(response);
  }

  @Authorization(true)
  @Post('/:id/posts')
  async createPost(
    @Body() body: CreatePostDto,
    @Param() _params: FindByIdDto, // ignoring this, its more safer to get the user's id from the auth middleware/guard
    @GetUser() user: UserEntity,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const payload: ICreatePost = { ...body, userId };
    const response: IResponse = await this.postServices.createPost(payload);
    return res.status(response.status).json(response);
  }
}
