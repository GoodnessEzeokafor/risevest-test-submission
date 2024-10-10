import { AddCommentDto, CreatePostDto, GetCommentQueryDto, GetPostsQueryDto } from '../dto';

export type IGetComments = GetCommentQueryDto;
export type IAddComments = AddCommentDto & {
    postId: string;
    userId: string;
};

export type ICreatePost = CreatePostDto & {
    userId: string;
};

export type IGetPosts = GetPostsQueryDto;
