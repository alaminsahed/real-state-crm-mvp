import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user.interface';
import { ReportsQueryDto } from './dto/reports-query.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('lead-sources')
  @ApiOperation({ summary: 'Lead counts grouped by source' })
  leadSources(
    @Query() query: ReportsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.reportsService.leadSources(user.id, query);
  }
}
