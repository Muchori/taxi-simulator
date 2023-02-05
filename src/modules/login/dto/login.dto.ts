import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/create-user.dto';

export class LoginDto extends PickType(UserDto, [
  'email',
  'password',
] as const) { }
