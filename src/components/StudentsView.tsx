import React, { useState } from 'react';
import { Plus, X, Search, Users } from 'lucide-react';
import { Student } from '../types';

interface StudentsViewProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

export default function StudentsView({ students, onAddStudent }: StudentsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');

  const uniqueGrades = Array.from(new Set(students.map(s => s.grade))).sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'All' || student.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Student Directory</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-3 sm:mt-0 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
          Add Student
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 dark:text-white bg-transparent ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="sm:w-48">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="All">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Grade</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Attendance</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Enrolled Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">{student.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{student.grade}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                     <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        student.attendance >= 90 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20 dark:ring-green-500/20' :
                        student.attendance >= 80 ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 ring-yellow-600/20 dark:ring-yellow-500/20' :
                        'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/10 dark:ring-red-500/20'
                      }`}>
                        {student.attendance}%
                      </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{student.enrolledDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                      <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchTerm ? "We couldn't find any students matching your search." : "Get started by adding a new student to the directory."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddStudentModal
          onClose={() => setIsModalOpen(false)}
          onAdd={(data) => {
            onAddStudent(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AddStudentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: Omit<Student, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [attendance, setAttendance] = useState('100');
  const [enrolledDate, setEnrolledDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !grade) return;
    onAdd({
      name,
      grade,
      attendance: Number(attendance),
      enrolledDate,
    });
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">Add New Student</h3>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Grade Level</label>
                  <input
                    type="text"
                    name="grade"
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. 10th Grade"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="attendance" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Attendance (%)</label>
                    <input
                      type="number"
                      name="attendance"
                      id="attendance"
                      min="0"
                      max="100"
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="enrolledDate" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Enrollment Date</label>
                    <input
                      type="date"
                      name="enrolledDate"
                      id="enrolledDate"
                      value={enrolledDate}
                      onChange={(e) => setEnrolledDate(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                  >
                    Save Student
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
