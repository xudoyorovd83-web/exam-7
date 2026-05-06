import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CreateAttendanceDto } from './attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(dto: CreateAttendanceDto): Promise<Attendance> {
    const record = this.attendanceRepository.create(dto);
    return this.attendanceRepository.save(record);
  }

  async bulkCreate(records: CreateAttendanceDto[]): Promise<Attendance[]> {
    const entities = this.attendanceRepository.create(records);
    return this.attendanceRepository.save(entities);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['student', 'group'],
      order: { date: 'DESC' },
    });
  }

  async findByDate(date: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { date },
      relations: ['student', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByGroup(groupId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { groupId },
      relations: ['student'],
      order: { date: 'DESC' },
    });
  }

  async findByGroupAndDate(groupId: number, date: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { groupId, date },
      relations: ['student'],
    });
  }

  async findOne(id: number): Promise<Attendance> {
    const record = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['student', 'group'],
    });
    if (!record) throw new NotFoundException('Attendance record not found');
    return record;
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.attendanceRepository.remove(record);
  }
}
