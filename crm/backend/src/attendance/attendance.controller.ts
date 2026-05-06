import {
  Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './attendance.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Mark single attendance' })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Mark attendance for multiple students' })
  bulkCreate(@Body() records: CreateAttendanceDto[]) {
    return this.attendanceService.bulkCreate(records);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Get attendance by date (YYYY-MM-DD)' })
  findByDate(@Param('date') date: string) {
    return this.attendanceService.findByDate(date);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get attendance by group' })
  findByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.attendanceService.findByGroup(groupId);
  }

  @Get('group/:groupId/date/:date')
  @ApiOperation({ summary: 'Get attendance by group and date' })
  findByGroupAndDate(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('date') date: string,
  ) {
    return this.attendanceService.findByGroupAndDate(groupId, date);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attendance record' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
