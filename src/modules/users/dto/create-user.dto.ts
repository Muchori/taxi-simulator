import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '0700000000' })
  @IsNotEmpty()
  phoneNumber: string;
}
