/**
 * domain.ts
 * Real application domain models and shared TypeScript interfaces.
 * Replaces old mock-db type declarations with clean, typed models.
 */

export type Role = 'pump_owner' | 'logistic' | 'admin' | 'investor' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  roles: Role[];
  status?: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  [key: string]: any;
}

export interface OTPRecord {
  identifier: string;
  code: string;
  type: 'sms' | 'email';
  expiresAt: number;
}

export interface Pump {
  id: string;
  name: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  status: 'approved' | 'pending' | 'under_review' | 'rejected' | 'suspended';
  owner?: string;
  owner_id?: string;
  revenue?: number;
  tanks_count?: number;
  nozzles_count?: number;
  createdAt?: string;
  [key: string]: any;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  contact: string;
  status: string;
  [key: string]: any;
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  investment: number;
  [key: string]: any;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  date: string;
  [key: string]: any;
}

export interface SubscriptionRecord {
  id: string;
  plan: string;
  status: string;
  expiresAt: string;
  [key: string]: any;
}

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  [key: string]: any;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: string;
  userId: string;
  messages: any[];
  createdAt: string;
  [key: string]: any;
}

export interface FraudAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  resolved: boolean;
  [key: string]: any;
}

export interface ShiftDetails {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'missed' | 'in_progress';
  pumpId?: string;
  [key: string]: any;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  [key: string]: any;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinedAt: string;
  performanceScore?: number;
  [key: string]: any;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'processing';
  [key: string]: any;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  type: 'sick' | 'casual' | 'earned' | 'unpaid';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  [key: string]: any;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half_day' | 'leave' | 'Present' | 'Late' | 'Absent' | 'Leave';
  hoursWorked?: number;
  [key: string]: any;
}
