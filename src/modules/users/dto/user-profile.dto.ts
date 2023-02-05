import { OmitType } from '@nestjs/swagger';
import { DriverDto } from './create-driver.dto';
import { UserDto } from './create-user.dto';

export class UserProfileDto extends OmitType(UserDto || DriverDto, [
  'password',
] as const) { }
