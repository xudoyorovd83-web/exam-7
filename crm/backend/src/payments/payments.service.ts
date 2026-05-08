import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(dto);
    return this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudent(studentId: number): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { studentId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentsRepository.remove(payment);
  }

  async totalThisMonth(): Promise<number> {
  const result = await this.paymentsRepository
    .createQueryBuilder('payment')
    .select('SUM(payment.amount)', 'total')
    .where(
      `DATE_TRUNC('month', payment.date) = DATE_TRUNC('month', CURRENT_DATE)`
    )
    .getRawOne();

  return parseFloat(result.total) || 0;
}
}
