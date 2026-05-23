import { Users, DollarSign, AlertCircle, CheckCircle, Download, Activity, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Student, TuitionRecord } from '../types';

interface DashboardViewProps {
  students: Student[];
  tuitionRecords: TuitionRecord[];
}

export default function DashboardView({ students, tuitionRecords }: DashboardViewProps) {
  const totalStudents = students.length;
  
  const totalCollected = tuitionRecords
    .filter((r) => r.status === 'Paid')
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingAmount = tuitionRecords
    .filter((r) => r.status === 'Pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const overdueAmount = tuitionRecords
    .filter((r) => r.status === 'Overdue')
    .reduce((sum, r) => sum + r.amount, 0);

  const recentPayments = [...tuitionRecords]
    .filter((r) => r.status === 'Paid' && r.paymentDate)
    .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
    .slice(0, 5);

  const pieData = [
    { name: 'Paid', value: totalCollected, color: '#10b981' },
    { name: 'Pending', value: pendingAmount, color: '#eab308' },
    { name: 'Overdue', value: overdueAmount, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const getLast6Months = () => {
    const months = [];
    const date = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        revenue: 0,
      });
    }
    return months;
  };

  const lineChartData = getLast6Months();
  
  tuitionRecords.forEach((record) => {
    if (record.status === 'Paid' && record.paymentDate) {
      const pDate = new Date(record.paymentDate);
      const match = lineChartData.find(
        (m) => m.year === pDate.getFullYear() && m.month === pDate.getMonth()
      );
      if (match) {
        match.revenue += record.amount;
      }
    }
  });

  const handleExport = () => {
    const headers = [
      'Student Name',
      'Grade',
      'Attendance (%)',
      'Enrolled Date',
      'Total Tuition ($)',
      'Paid ($)',
      'Pending ($)',
      'Overdue ($)'
    ];

    const csvData = students.map(student => {
      const studentTuition = tuitionRecords.filter(t => t.studentId === student.id);
      const total = studentTuition.reduce((sum, t) => sum + t.amount, 0);
      const paid = studentTuition.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
      const pending = studentTuition.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
      const overdue = studentTuition.filter(t => t.status === 'Overdue').reduce((sum, t) => sum + t.amount, 0);

      return [
        `"${student.name}"`,
        `"${student.grade}"`,
        student.attendance,
        student.enrolledDate,
        total,
        paid,
        pending,
        overdue
      ].join(',');
    });

    const csvString = [headers.join(','), ...csvData].join('\n');
    
    // Trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_tuition_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <button
          onClick={handleExport}
          className="mt-3 sm:mt-0 inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Download className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students Card */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:p-6 flex items-center">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="ml-4">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalStudents}</dd>
          </div>
        </div>

        {/* Collected Tuition Card */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:p-6 flex items-center">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="ml-4">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Collected</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              ${totalCollected.toLocaleString()}
            </dd>
          </div>
        </div>

        {/* Pending Card */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:p-6 flex items-center">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
            <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="ml-4">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tuition</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              ${pendingAmount.toLocaleString()}
            </dd>
          </div>
        </div>

        {/* Overdue Card */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:p-6 flex items-center">
          <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-4">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Tuition</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              ${overdueAmount.toLocaleString()}
            </dd>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Tuition Distribution Chart */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white text-left">Tuition Distribution</h2>
          <div className="mt-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow p-6 flex flex-col items-center justify-center min-h-[300px]">
            {pieData.length > 0 ? (
              <div className="w-full h-[300px] min-w-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: 'var(--color-gray-800, #1f2937)', color: 'var(--color-gray-100, #f3f4f6)', border: 'none', borderRadius: '0.375rem' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 w-full h-full">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                  <PieChartIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">No data available</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  There are no tuition records to display yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white text-left">Recent Payments</h2>
          <div className="mt-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            {recentPayments.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentPayments.map((payment) => {
                  const student = students.find((s) => s.id === payment.studentId);
                  return (
                    <li key={payment.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{student?.name || 'Unknown Student'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Paid on {payment.paymentDate}</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/20">
                          +${payment.amount.toLocaleString()}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                  <Activity className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">No recent payments</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Recent tuition payments will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white text-left">Revenue Trend (Last 6 Months)</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow p-6 flex flex-col items-center justify-center min-h-[300px]">
          {lineChartData.some(d => d.revenue > 0) ? (
            <div className="w-full h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => `$${val}`}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`} 
                    contentStyle={{ backgroundColor: 'var(--color-gray-800, #1f2937)', color: 'var(--color-gray-100, #f3f4f6)', border: 'none', borderRadius: '0.375rem' }} 
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: "#4f46e5" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center h-[300px] w-full">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                <LineChartIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">No revenue yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Revenue trends will appear once payments are recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
