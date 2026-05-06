export interface User {
  id: number
  fullName: string
  phone: string
  role: 'SUPERADMIN' | 'ADMIN'
  createdAt: string
}

export interface Teacher {
  id: number
  fullName: string
  phone: string
  subject?: string
  groups?: Group[]
  createdAt: string
}

export interface Student {
  id: number
  fullName: string
  phone: string
  status: 'active' | 'inactive'
  groupId?: number
  group?: Group
  createdAt: string
}

export interface Group {
  id: number
  name: string
  teacherId?: number
  teacher?: Teacher
  students?: Student[]
  schedule?: string
  createdAt: string
}

export interface Payment {
  id: number
  studentId: number
  student?: Student
  amount: number
  date: string
  note?: string
  createdAt: string
}

export interface Attendance {
  id: number
  studentId: number
  student?: Student
  groupId: number
  group?: Group
  status: 'present' | 'absent'
  date: string
  createdAt: string
}

export interface Request {
  id: number
  name: string
  phone: string
  message?: string
  status: 'new' | 'in_progress' | 'done' | 'rejected'
  createdAt: string
}

export interface DashboardSummary {
  totalStudents: number
  activeStudents: number
  studentsLeftThisMonth: number
  totalTeachers: number
  totalGroups: number
  todayRequests: number
  yesterdayRequests: number
  monthlyRevenue: number
}

export interface AuthResponse {
  access_token: string
  user: User
}
