import { Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { GroupsService } from '../groups/groups.service';
import { RequestsService } from '../requests/requests.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class ReportsService {
  constructor(
    private studentsService: StudentsService,
    private teachersService: TeachersService,
    private groupsService: GroupsService,
    private requestsService: RequestsService,
    private paymentsService: PaymentsService,
  ) {}

  async getSummary() {
    const [
      totalStudents,
      activeStudents,
      studentsLeftThisMonth,
      totalTeachers,
      totalGroups,
      todayRequests,
      yesterdayRequests,
      monthlyRevenue,
    ] = await Promise.all([
      this.studentsService.count(),
      this.studentsService.countActive(),
      this.studentsService.countLeftThisMonth(),
      this.teachersService.count(),
      this.groupsService.count(),
      this.requestsService.countToday(),
      this.requestsService.countYesterday(),
      this.paymentsService.totalThisMonth(),
    ]);

    return {
      totalStudents,
      activeStudents,
      studentsLeftThisMonth,
      totalTeachers,
      totalGroups,
      todayRequests,
      yesterdayRequests,
      monthlyRevenue,
    };
  }

  async getTotalStudents() {
    return {
      total: await this.studentsService.count(),
      active: await this.studentsService.countActive(),
    };
  }

  async getStudentsLeftThisMonth() {
    return { count: await this.studentsService.countLeftThisMonth() };
  }

  async getTotalGroups() {
    return { total: await this.groupsService.count() };
  }

  async getTotalTeachers() {
    return { total: await this.teachersService.count() };
  }

  async getTodayRequests() {
    return {
      count: await this.requestsService.countToday(),
      requests: await this.requestsService.findToday(),
    };
  }

  async getYesterdayRequests() {
    return {
      count: await this.requestsService.countYesterday(),
      requests: await this.requestsService.findYesterday(),
    };
  }

  async getMonthlyRevenue() {
    return { total: await this.paymentsService.totalThisMonth() };
  }
}
