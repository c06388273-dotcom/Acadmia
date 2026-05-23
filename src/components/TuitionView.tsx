import React, { useState } from 'react';
import { Plus, X, HandCoins, Calendar, Receipt } from 'lucide-react';
import { Student, TuitionRecord } from '../types';

interface TuitionViewProps {
  students: Student[];
  tuitionRecords: TuitionRecord[];
  onAddTuition: (record: Omit<TuitionRecord, 'id'>) => void;
  onMarkPaid: (id: string) => void;
}

export default function TuitionView({ students, tuitionRecords, onAddTuition, onMarkPaid }: TuitionViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort records: overdues first, then pendings, then paid (newest first)
  const sortedRecords = [...tuitionRecords].sort((a, b) => {
    const statusOrder = { 'Overdue': 1, 'Pending': 2, 'Paid': 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // If both paid, sort by payment date descending
    if (a.status === 'Paid' && a.paymentDate && b.paymentDate) {
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    }
    // Otherwise sort by due date ascending
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tuition Tracker</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-3 sm:mt-0 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
          Issue Tuition Bill
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">Student</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Amount</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Due Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record) => {
                const student = students.find((s) => s.id === record.studentId);
                return (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                      {student?.name || 'Unknown Student'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      ${record.amount.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {record.dueDate}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                       <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          record.status === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20 dark:ring-emerald-500/20' :
                          record.status === 'Pending' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 ring-yellow-600/20 dark:ring-yellow-500/20' :
                          'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/10 dark:ring-red-500/20'
                        }`}>
                          {record.status}
                        </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {record.status !== 'Paid' && (
                        <button
                          onClick={() => onMarkPaid(record.id)}
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          <HandCoins className="h-4 w-4" />
                          Mark Paid
                        </button>
                      )}
                      {record.status === 'Paid' && (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">Paid on {record.paymentDate}</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                      <Receipt className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">No tuition records</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Issue a new tuition bill to a student to get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddTuitionModal
          students={students}
          onClose={() => setIsModalOpen(false)}
          onAdd={(data) => {
            onAddTuition(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AddTuitionModal({ students, onClose, onAdd }: { students: Student[], onClose: () => void; onAdd: (data: Omit<TuitionRecord, 'id'>) => void }) {
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !amount || !dueDate) return;
    onAdd({
      studentId,
      amount: Number(amount),
      dueDate,
      status: 'Pending',
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
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">Record Tuition Bill</h3>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="student" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Student</label>
                  <select
                    id="student"
                    name="student"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  >
                    <option value="" disabled>Select a student</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Amount ($)</label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    disabled={!studentId}
                  >
                    Issue Bill
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
