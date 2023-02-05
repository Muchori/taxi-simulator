import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { toNumber } from 'lodash';

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
  @ApiProperty({ example: 1 })
  passengerId: string;

  @ApiProperty({ example: 3 })
  driverId: string;

  // @ApiProperty({ type: () => RideStatus })
  status?: string;

  @ApiProperty({ type: () => LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  pickupPoint: LocationDto;

  @ApiProperty({ type: () => LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  destination: LocationDto;
}
