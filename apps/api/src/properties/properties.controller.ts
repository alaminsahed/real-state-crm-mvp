import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user.interface';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertiesService } from './properties.service';

@UseGuards(JwtAuthGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  async create(
    @Body() dto: CreatePropertyDto,
    @CurrentUser() user: RequestUser,
  ) {
    const [property] = await this.propertiesService.create(dto, user.id);
    return property;
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.propertiesService.findAll(user.id);
  }
}
