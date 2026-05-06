import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Request } from './request.entity';
import { CreateRequestDto, UpdateRequestDto } from './request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  async create(dto: CreateRequestDto): Promise<Request> {
    const request = this.requestsRepository.create(dto);
    return this.requestsRepository.save(request);
  }

  async findAll(): Promise<Request[]> {
    return this.requestsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Request> {
    const request = await this.requestsRepository.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async update(id: number, dto: UpdateRequestDto): Promise<Request> {
    const request = await this.findOne(id);
    Object.assign(request, dto);
    return this.requestsRepository.save(request);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findOne(id);
    await this.requestsRepository.remove(request);
  }

  async findToday(): Promise<Request[]> {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    return this.requestsRepository.find({
      where: { createdAt: Between(start, end) },
      order: { createdAt: 'DESC' },
    });
  }

  async findYesterday(): Promise<Request[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
    const end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
    return this.requestsRepository.find({
      where: { createdAt: Between(start, end) },
      order: { createdAt: 'DESC' },
    });
  }

  async countToday(): Promise<number> {
    const requests = await this.findToday();
    return requests.length;
  }

  async countYesterday(): Promise<number> {
    const requests = await this.findYesterday();
    return requests.length;
  }
}
