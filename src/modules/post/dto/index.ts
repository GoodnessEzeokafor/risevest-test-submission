import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ExtraQueryDto } from 'src/shared';


/** POST DTO */

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  public readonly title: string;

  @IsNotEmpty()
  @IsString()
  public readonly content: string;
}
export class GetPostsQueryDto extends ExtraQueryDto {
  @IsOptional()
  @IsUUID()
  public readonly id: string;

  @IsOptional()
  @IsString()
  public readonly title: string;

  @IsOptional()
  @IsUUID()
  public readonly userId: string;
}

/** COMMENT DTO */

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  public readonly comment: string;
}

export class GetCommentQueryDto extends ExtraQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  public readonly id: number;

  @IsOptional()
  @IsUUID()
  public readonly userId: string;

  @IsOptional()
  @IsUUID()
  public readonly postId: string;
}
