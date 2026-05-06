import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RequestStatus } from './request.entity';

export class CreateRequestDto {
  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'I want to enroll in math courses', required: false })
  @IsString()
  @IsOptional()
  message?: string;
}

export class UpdateRequestDto {
  @ApiProperty({ enum: RequestStatus, required: false })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;
}
