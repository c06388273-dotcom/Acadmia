import { useState, useEffect } from 'react';
import { Student, TuitionRecord } from './types';

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Johnson', grade: '10th Grade', attendance: 95, enrolledDate: '2025-09-01' },
  { id: '2', name: 'Bob Smith', grade: '9th Grade', attendance: 88, enrolledDate: '2025-09-01' },
  { id: '3', name: 'Clara Davis', grade: '11th Grade', attendance: 92, enrolledDate: '2025-09-01' },
];

const INITIAL_TUITION: TuitionRecord[] = [
  { id: '101', studentId: '1', amount: 5000, dueDate: '2026-06-01', status: 'Paid', paymentDate: '2026-05-15' },
  { id: '102', studentId: '2', amount: 5000, dueDate: '2026-06-01', status: 'Pending' },
  { id: '103', studentId: '3', amount: 5500, dueDate: '2026-05-01', status: 'Overdue' },
];

export function useSchoolStore() {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('school_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [tuitionRecords, setTuitionRecords] = useState<TuitionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('school_tuition');
      return saved ? JSON.parse(saved) : INITIAL_TUITION;
    } catch {
      return INITIAL_TUITION;
    }
  });

  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_tuition', JSON.stringify(tuitionRecords));
  }, [tuitionRecords]);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const addTuitionRecord = (record: Omit<TuitionRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setTuitionRecords((prev) => [...prev, newRecord]);
  };

  const markPaid = (recordId: string) => {
    setTuitionRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] }
          : r
      )
    );
  };

  const updateTuitionStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    setTuitionRecords((prev) =>
      prev.map((r) => {
        if (r.status === 'Pending' && r.dueDate < today) {
          return { ...r, status: 'Overdue' };
        }
        return r;
      })
    );
  };

  useEffect(() => {
    updateTuitionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on load to update overdues

  return {
    students,
    tuitionRecords,
    addStudent,
    updateStudent,
    addTuitionRecord,
    markPaid,
  };
}
