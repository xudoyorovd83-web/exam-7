import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsDateString } from 'class-validator';
import { AttendanceStatus } from './attendance.entity';

export class CreateAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  studentId!: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  groupId!: number;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date!: string;
}

export class BulkAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  groupId!: number;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date!: string;

  @ApiProperty({ type: [CreateAttendanceDto] })
  records!: CreateAttendanceDto[];
}
