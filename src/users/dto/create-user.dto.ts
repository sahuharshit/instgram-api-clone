import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  username: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
