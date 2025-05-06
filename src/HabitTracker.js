import { useState } from 'react';
import { Calendar, CheckCircle, Award, Settings as SettingsIcon, PieChart, ArrowLeft, ArrowRight } from 'lucide-react';

// Main App Component
export default function HabitTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', streak: 5, target: 7, completed: [1, 2, 3, 4, 5], color: '#4CAF50' },
    { id: 2, name: 'Read 30 minutes', streak: 3, target: 7, completed: [2, 4, 6], color: '#2196F3' },
    { id: 3, name: 'Exercise', streak: 0, target: 5, completed: [], color: '#FF5722' },
    { id: 4, name: 'Drink 8 cups of water', streak: 7, target: 7, completed: [1, 2, 3, 4, 5, 6, 7], color: '#9C27B0' }
  ]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [currentWeek] = useState(getCurrentWeek());
  const [isAnimating, setIsAnimating] = useState(null);

  // Get current week days
  function getCurrentWeek() {
    const days = [];
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Start with Sunday of current week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        date: date.getDate(),
        dayNumber: i + 1,
        isToday: i === day
      });
    }
    
    return days;
  }

  // Toggle habit completion for today
  const toggleHabitCompletion = (habitId) => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        if (habit.id === habitId) {
          // Check if today is already marked as completed
          const today = new Date().getDay() + 1;
          const isCompleted = habit.completed.includes(today);
          
          // Toggle completion
          let newCompleted = [...habit.completed];
          if (isCompleted) {
            newCompleted = newCompleted.filter(day => day !== today);
          } else {
            newCompleted.push(today);
            setIsAnimating(habitId);
            setTimeout(() => setIsAnimating(null), 1000);
          }
          
          // Update streak
          let newStreak = isCompleted ? habit.streak - 1 : habit.streak + 1;
          if (newStreak < 0) newStreak = 0;
          
          return {
            ...habit,
            completed: newCompleted,
            streak: newStreak
          };
        }
        return habit;
      });
    });
  };

  // Show detailed view for a habit
  const showHabitDetail = (habit) => {
    setSelectedHabit(habit);
    setActiveTab('detail');
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalCompleted = habits.reduce((sum, habit) => sum + habit.completed.length, 0);
    const totalTargets = habits.reduce((sum, habit) => sum + habit.target, 0);
    return (totalCompleted / totalTargets) * 100;
  };

  // Navigation component
  const Navigation = () => (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-lg">
      <h1 className="text-xl font-bold">Habit Tracker</h1>
      <div className="flex space-x-4">
        <button 
          className={`flex items-center ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-gray-300'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <PieChart size={20} className="mr-1" />
          <span className="hidden md:inline">Dashboard</span>
        </button>
        <button 
          className={`flex items-center ${activeTab === 'calendar' ? 'text-blue-400' : 'text-gray-300'}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={20} className="mr-1" />
          <span className="hidden md:inline">Calendar</span>
        </button>
        <button 
          className={`flex items-center ${activeTab === 'settings' ? 'text-blue-400' : 'text-gray-300'}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={20} className="mr-1" />
          <span className="hidden md:inline">Settings</span>
        </button>
      </div>
    </div>
  );

  // Dashboard Tab
  const Dashboard = () => (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="opacity-80">You're making great progress on your habits.</p>
        <div className="mt-4">
          <div className="relative h-4 bg-gray-200 bg-opacity-30 rounded-full">
            <div 
              className="h-4 bg-white rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs opacity-80">Progress</span>
            <span className="text-xs font-bold">{Math.round(calculateOverallProgress())}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {currentWeek.map(day => (
          <div 
            key={day.dayNumber}
            className={`flex flex-col items-center p-3 rounded-lg ${day.isToday ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100'}`}
          >
            <span className="text-sm font-medium text-gray-600">{day.dayName}</span>
            <span className={`text-lg font-bold ${day.isToday ? 'text-blue-500' : 'text-gray-700'}`}>{day.date}</span>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold text-gray-700">Your Habits</h3>
      
      <div className="space-y-4">
        {habits.map(habit => (
          <div 
            key={habit.id} 
            className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg"
            onClick={() => showHabitDetail(habit)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800">{habit.name}</h4>
                <div className="flex items-center mt-1">
                  <Award size={16} className="text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">Streak: {habit.streak} days</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${isAnimating === habit.id ? 'animate-ping' : ''}`}
                  style={{ backgroundColor: habit.color + '20' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHabitCompletion(habit.id);
                  }}
                >
                  <CheckCircle 
                    size={24} 
                    className={`transition-all duration-300 ${habit.completed.includes(new Date().getDay() + 1) ? 'text-green-500 scale-110' : 'text-gray-300'}`} 
                  />
                </div>
                <span className="text-xs mt-1 text-gray-500">Today</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(habit.completed.length / habit.target) * 100}%`,
                    backgroundColor: habit.color 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{habit.completed.length}/{habit.target} days</span>
                <span className="text-xs text-gray-500">{Math.round((habit.completed.length / habit.target) * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Calendar Tab
  const CalendarView = () => (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold">May 2025</h3>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* Sample calendar days */}
          {Array(35).fill(0).map((_, index) => {
            const day = index - 3; // Adjust to start from correct day of week
            const isCurrentMonth = day >= 0 && day < 31;
            const isToday = day === 5; // Example for demo
            
            const hasHabits = isCurrentMonth && Math.random() > 0.5;
            
            return (
              <div 
                key={index}
                className={`
                  aspect-square flex flex-col items-center justify-center text-sm rounded-md
                  ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                  ${isToday ? 'bg-blue-100 border border-blue-400' : hasHabits ? 'bg-green-50' : ''}
                `}
              >
                {isCurrentMonth ? day + 1 : day < 0 ? 30 + day + 1 : day - 30 + 1}
                {hasHabits && isCurrentMonth && (
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-700 mb-3">Habit Performance</h3>
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="bg-white rounded-lg shadow-md p-4">
              <h4 className="font-bold text-gray-800">{habit.name}</h4>
              <div className="mt-3 flex space-x-1">
                {Array(30).fill(0).map((_, index) => {
                  const isCompleted = Math.random() > 0.3; // Random for demo
                  return (
                    <div 
                      key={index}
                      className={`flex-1 h-8 rounded-sm ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Past 30 days</span>
                <span className="text-xs text-gray-500">73% completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Settings Tab
  const Settings = () => (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Default</option>
              <option>Dark</option>
              <option>Light</option>
              <option>Blue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notifications</label>
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <span className="ml-2 text-gray-700">Enable reminders</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
            <input type="time" className="w-full p-2 border border-gray-300 rounded-md" defaultValue="20:00" />
          </div>
          
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Manage Habits</h3>
        
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-bold text-gray-800">{habit.name}</h4>
                <p className="text-sm text-gray-500">Target: {habit.target} days per week</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <SettingsIcon size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors">
            + Add New Habit
          </button>
        </div>
      </div>
    </div>
  );

  // Habit Detail View
  const HabitDetail = () => {
    if (!selectedHabit) return null;
    
    return (
      <div className="p-4">
        <button 
          className="flex items-center text-blue-500 mb-4"
          onClick={() => {
            setSelectedHabit(null);
            setActiveTab('dashboard');
          }}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        
        <div 
          className="rounded-lg p-6 text-white shadow-lg mb-6"
          style={{ backgroundColor: selectedHabit.color }}
        >
          <h2 className="text-2xl font-bold mb-2">{selectedHabit.name}</h2>
          <div className="flex items-center">
            <Award size={20} className="mr-2" />
            <span>Current streak: {selectedHabit.streak} days</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="font-bold text-gray-700 mb-3">Weekly Progress</h3>
          <div className="flex justify-between space-x-3">
            {currentWeek.map(day => {
              const isCompleted = selectedHabit.completed.includes(day.dayNumber);
              return (
                <div key={day.dayNumber} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">{day.dayName}</span>
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="text-gray-700">{day.date}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-gray-700 mb-3">Habit Statistics</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Completion Rate</span>
                <span>{Math.round((selectedHabit.completed.length / selectedHabit.target) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(selectedHabit.completed.length / selectedHabit.target) * 100}%`,
                    backgroundColor: selectedHabit.color 
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Best Streak</span>
                <span>{selectedHabit.streak + Math.floor(Math.random() * 5)} days</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Total Completions</span>
                <span>{selectedHabit.completed.length + Math.floor(Math.random() * 30)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              className="w-full py-2 rounded-md text-white font-medium transition-colors"
              style={{ backgroundColor: selectedHabit.color }}
            >
              {selectedHabit.completed.includes(new Date().getDay() + 1) 
                ? 'Mark Today As Incomplete' 
                : 'Complete Today'
              }
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'detail' && <HabitDetail />}
      </div>
    </div>
  );
}