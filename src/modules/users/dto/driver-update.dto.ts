import { PartialType } from '@nestjs/swagger';
import { DriverDto } from './create-driver.dto';

export class DriverUpdateDto extends PartialType(DriverDto) { }
