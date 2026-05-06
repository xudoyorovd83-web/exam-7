import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Math Group A' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  teacherId!: number;

  @ApiProperty({ example: 'Mon/Wed/Fri 10:00-11:30', required: false })
  @IsString()
  @IsOptional()
  schedule?: string;
}

export class UpdateGroupDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  teacherId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  schedule?: string;
}
