export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number; // percentage, e.g., 95
  enrolledDate: string;
}

export interface TuitionRecord {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export type ViewState = 'dashboard' | 'students' | 'tuition';
