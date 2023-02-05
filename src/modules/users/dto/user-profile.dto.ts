import { OmitType } from '@nestjs/swagger';
import { UserDto } from './create-user.dto';

export class UserProfileDto extends OmitType(UserDto, ['password'] as const) { }
