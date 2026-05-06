import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import StudentsPage from './pages/students/StudentsPage'
import TeachersPage from './pages/teachers/TeachersPage'
import GroupsPage from './pages/groups/GroupsPage'
import PaymentsPage from './pages/payments/PaymentsPage'
import AttendancePage from './pages/attendance/AttendancePage'
import RequestsPage from './pages/requests/RequestsPage'
import AdminsPage from './pages/dashboard/AdminsPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/admins" element={<AdminsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
