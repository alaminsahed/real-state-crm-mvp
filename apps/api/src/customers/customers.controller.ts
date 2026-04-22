import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: RequestUser,
  ) {
    const [customer] = await this.customersService.create(dto, user.id);
    return customer;
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.customersService.findAll(user.id);
  }
}
