import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { GroupsModule } from './groups/groups.module';
import { PaymentsModule } from './payments/payments.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RequestsModule } from './requests/requests.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Teacher } from './teachers/teacher.entity';
import { Student } from './students/student.entity';
import { Group } from './groups/group.entity';
import { Payment } from './payments/payment.entity';
import { Attendance } from './attendance/attendance.entity';
import { Request } from './requests/request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'crm_db'),
        entities: [User, Teacher, Student, Group, Payment, Attendance, Request],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TeachersModule,
    StudentsModule,
    GroupsModule,
    PaymentsModule,
    AttendanceModule,
    RequestsModule,
    ReportsModule,
  ],
})
export class AppModule {}
