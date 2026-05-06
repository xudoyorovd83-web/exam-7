import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Teacher } from '../teachers/teacher.entity';
import { Student } from '../students/student.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  teacherId: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.groups, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];

  @Column({ nullable: true })
  schedule: string;

  @CreateDateColumn()
  createdAt: Date;
}
