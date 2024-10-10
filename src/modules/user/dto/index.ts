import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ExtraQueryDto } from 'src/shared';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  public readonly email: string;

  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  public readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  public readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  public readonly email: string;

  @IsNotEmpty()
  @IsString()
  public readonly username: string;

  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}

export class GetUsersQueryDto extends ExtraQueryDto {
  @IsOptional()
  @IsUUID()
  public readonly id: string;

  @IsOptional()
  @IsString()
  public readonly firstName: string;

  @IsOptional()
  @IsString()
  public readonly lastName: string;

  @IsOptional()
  @IsString()
  public readonly email: string;
}
