import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ExtraQueryDto {
  @IsOptional()
  @IsString()
  public perPage: string;

  @IsOptional()
  @IsString()
  public page: string;

  @IsOptional()
  @IsString()
  public sort: string;

  @IsOptional()
  @IsString()
  public q: string;

  @IsOptional()
  @IsString()
  public to: string;

  @IsOptional()
  @IsString()
  public from: string;
}

export class FindByIdDto {
  @IsNotEmpty()
  @IsUUID()
  public id: string;
}

export class FindByPostIdDto {
  @IsNotEmpty()
  @IsUUID()
  public readonly postId: string;
}
