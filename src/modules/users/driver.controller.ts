import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { DriverService } from './driver.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Drivers')
@Controller({
  path: 'driver',
  version: '1',
})
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto) {
    return this.driverService.create(createProfileDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.driverService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') driver_id: string) {
    return this.driverService.findOne({ driver_id: +driver_id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateProfileDto: UpdateUserDto) {
    return this.driverService.update(id, updateProfileDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Post(':id/suspend')
  async suspend(@Param('id') driver_id: number): Promise<string> {
    await this.driverService.suspend(driver_id);

    return 'success';
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Post(':id/suspend')
  async removeSuspend(@Param('id') driver_id: number): Promise<string> {
    await this.driverService.removeSuspend(driver_id);

    return 'success';
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.driverService.delete(id);
  }
}
