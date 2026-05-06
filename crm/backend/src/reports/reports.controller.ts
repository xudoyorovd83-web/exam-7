import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get full dashboard summary' })
  getSummary() {
    return this.reportsService.getSummary();
  }

  @Get('students/total')
  @ApiOperation({ summary: 'Get total students count' })
  getTotalStudents() {
    return this.reportsService.getTotalStudents();
  }

  @Get('students/left-this-month')
  @ApiOperation({ summary: 'Get students who left this month' })
  getStudentsLeftThisMonth() {
    return this.reportsService.getStudentsLeftThisMonth();
  }

  @Get('groups/total')
  @ApiOperation({ summary: 'Get total groups count' })
  getTotalGroups() {
    return this.reportsService.getTotalGroups();
  }

  @Get('teachers/total')
  @ApiOperation({ summary: 'Get total teachers count' })
  getTotalTeachers() {
    return this.reportsService.getTotalTeachers();
  }

  @Get('requests/today')
  @ApiOperation({ summary: "Get today's requests" })
  getTodayRequests() {
    return this.reportsService.getTodayRequests();
  }

  @Get('requests/yesterday')
  @ApiOperation({ summary: "Get yesterday's requests" })
  getYesterdayRequests() {
    return this.reportsService.getYesterdayRequests();
  }

  @Get('revenue/monthly')
  @ApiOperation({ summary: 'Get total revenue this month' })
  getMonthlyRevenue() {
    return this.reportsService.getMonthlyRevenue();
  }
}
