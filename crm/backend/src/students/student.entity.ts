import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Group } from '../groups/group.entity';
import { Payment } from '../payments/payment.entity';
import { Attendance } from '../attendance/attendance.entity';

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  phone!: string;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status!: StudentStatus;

  @Column({ nullable: true })
  groupId!: number;

  @ManyToOne(() => Group, (group) => group.students, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group!: Group;

  @OneToMany(() => Payment, (payment) => payment.student)
  payments!: Payment[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances!: Attendance[];

  @CreateDateColumn()
  createdAt!: Date;

  
  @Column({ type: 'timestamp', nullable: true })
leftAt!: Date;
}
