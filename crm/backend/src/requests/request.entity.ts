import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
} from 'typeorm';

export enum RequestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  REJECTED = 'rejected',
}

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  message!: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.NEW })
  status!: RequestStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
