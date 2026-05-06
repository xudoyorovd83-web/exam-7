import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { StudentStatus } from './student.entity';

export class CreateStudentDto {
  @ApiProperty({ example: 'Alice Johnson' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  groupId?: number;

  @ApiProperty({ enum: StudentStatus, example: StudentStatus.ACTIVE, required: false })
  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;
}

export class UpdateStudentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  groupId?: number;

  @ApiProperty({ enum: StudentStatus, required: false })
  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;
}
