import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Group } from '../groups/group.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  subject!: string;

  @OneToMany(() => Group, (group) => group.teacher)
  groups!: Group[];

  @CreateDateColumn()
  createdAt!: Date;
}
