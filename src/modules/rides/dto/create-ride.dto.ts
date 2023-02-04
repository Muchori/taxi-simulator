import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { toNumber } from 'lodash';
import { Status } from 'src/modules/statuses/entities/status.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class LocationDto {
  @ApiProperty({ type: () => Number })
  @Transform(({ value }) => toNumber(value))
  @IsNotEmpty({ message: 'Latitude is required' })
  latitude: number;

  @ApiProperty({ type: () => Number })
  @Transform(({ value }) => toNumber(value))
  @IsNotEmpty({ message: 'Longitude is required' })
  longitude: number;
}

export class CreateRideDto {
  @ApiProperty({ type: Status })
  @Validate(IsExist, ['Status', 'id'], {
    message: 'statusNotExists',
  })
  status?: Status;

  @ApiProperty({ type: () => LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  pickupPoint: LocationDto;

  @ApiProperty({ type: () => LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  destination: LocationDto;
}
