import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CreditCard, GraduationCap, Moon, Sun } from 'lucide-react';
import { ViewState } from './types';
import { useSchoolStore } from './store';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import TuitionView from './components/TuitionView';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const { students, tuitionRecords, addStudent, addTuitionRecord, markPaid } = useSchoolStore();
  
  const overdueCount = tuitionRecords.filter(r => r.status === 'Overdue').length;

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'tuition', name: 'Tuition Tracker', icon: CreditCard },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row transition-colors duration-200">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md md:h-screen md:sticky top-0 flex-shrink-0 flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
          <span className="text-xl font-bold text-gray-900 dark:text-white font-sans tracking-tight">Academia</span>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.name}
                onClick={() => setActiveView(item.id)}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <div className="flex items-center">
                  <Icon
                    className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.id === 'tuition' && overdueCount > 0 && (
                  <span className="ml-auto inline-block py-0.5 px-2 text-xs font-semibold rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {overdueCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {isDark ? (
              <>
                <Sun className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 text-gray-400" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        {activeView === 'dashboard' && (
          <DashboardView students={students} tuitionRecords={tuitionRecords} />
        )}
        {activeView === 'students' && (
          <StudentsView students={students} onAddStudent={addStudent} />
        )}
        {activeView === 'tuition' && (
          <TuitionView
            students={students}
            tuitionRecords={tuitionRecords}
            onAddTuition={addTuitionRecord}
            onMarkPaid={markPaid}
          />
        )}
      </div>
    </div>
  );
}
