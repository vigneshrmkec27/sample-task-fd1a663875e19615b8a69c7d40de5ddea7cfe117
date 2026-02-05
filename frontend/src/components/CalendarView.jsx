import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toDateKey = (date) => date.toISOString().split('T')[0];

const CalendarView = ({ tasks, selectedDate, currentMonth, onMonthChange, onDateSelect }) => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startDay; i += 1) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }

    const tasksByDate = tasks.reduce((acc, task) => {
        if (!task?.dueDate) return acc;
        if (!acc[task.dueDate]) {
            acc[task.dueDate] = [];
        }
        acc[task.dueDate].push(task);
        return acc;
    }, {});

    const isSameDay = (date, compare) => toDateKey(date) === toDateKey(compare);

    return (
        <div className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Calendar View</p>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        className="p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onMonthChange(new Date())}
                        className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        className="p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
                        aria-label="Next month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {dayLabels.map((day) => (
                    <div key={day} className="text-center py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} className="h-28 rounded-xl bg-transparent" />;
                    }

                    const dateKey = toDateKey(day);
                    const dayTasks = tasksByDate[dateKey] || [];
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                        <button
                            key={dateKey}
                            onClick={() => onDateSelect(day)}
                            className={`h-28 rounded-2xl border text-left p-2.5 transition ${
                                isSelected
                                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/20'
                                    : 'border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:shadow-md'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {day.getDate()}
                                </span>
                                {dayTasks.length > 0 && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-200">
                                        {dayTasks.length}
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 space-y-1">
                                {dayTasks.slice(0, 2).map((task) => (
                                    <div
                                        key={task.id}
                                        className="text-[10px] truncate rounded-lg bg-gray-100/90 dark:bg-white/10 px-2 py-1 text-gray-700 dark:text-gray-200"
                                    >
                                        {task.taskName}
                                    </div>
                                ))}
                                {dayTasks.length > 2 && (
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                        +{dayTasks.length - 2} more
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
