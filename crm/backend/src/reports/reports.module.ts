import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';
import { GroupsModule } from '../groups/groups.module';
import { RequestsModule } from '../requests/requests.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [StudentsModule, TeachersModule, GroupsModule, RequestsModule, PaymentsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
