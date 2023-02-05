import { PartialType } from '@nestjs/swagger';
import { UserDto } from './create-user.dto';

export class UserUpdateDto extends PartialType(UserDto) { }
