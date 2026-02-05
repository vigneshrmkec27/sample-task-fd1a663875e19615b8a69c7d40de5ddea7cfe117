import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Plus, Calendar, LogOut,
    Sun, Moon, Check, ChevronLeft, ChevronRight, UserCircle,
    LayoutGrid, List
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { getTaskStats } from '../utils/helpers';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import TaskDetail from './TaskDetail';
import LiveClock from './LiveClock';
import CalendarView from './CalendarView';
import ProfilePanel from './ProfilePanel';

const Dashboard = ({ user, darkMode, setDarkMode, showNotification, onUserUpdate }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [animatedStats, setAnimatedStats] = useState({ total: 0, inProgress: 0, completed: 0 });

    const tasksPerPage = 9;

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await taskService.getAllTasks();
            let taskList = [];

            if (response && response.content) {
                taskList = Array.isArray(response.content) ? response.content : [];
            } else if (Array.isArray(response)) {
                taskList = response;
            }
            setTasks(taskList);
        } catch {
            showNotification('Failed to fetch tasks', 'error');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    const applyFilters = useCallback(() => {
        let result = [...tasks];

        if (searchQuery.trim()) {
            result = result.filter(task =>
                task.taskName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (priorityFilter !== 'ALL') result = result.filter(t => t.priority === priorityFilter);
        if (statusFilter !== 'ALL') result = result.filter(t => t.status === statusFilter);

        setFilteredTasks(result);
        setCurrentPage(1);
    }, [priorityFilter, searchQuery, statusFilter, tasks]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);
    useEffect(() => { applyFilters(); }, [applyFilters]);

    const handleLogout = () => {
        authService.logout();
        window.location.reload();
    };

    const handleDownloadReport = () => {
        if (!tasks.length) {
            showNotification('No tasks available to download.', 'error');
            return;
        }

        const header = ['Task Name', 'Description', 'Priority', 'Status', 'Due Date'];
        const rows = tasks.map((task) => ([
            task.taskName || '',
            task.description || '',
            task.priority || '',
            task.status || '',
            task.dueDate || ''
        ]));

        const escapeValue = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csvContent = [header, ...rows]
            .map((row) => row.map(escapeValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotification('Report download started.');
    };

    const openTaskModal = (task = null) => {
        setSelectedTask(task);
        setShowTaskModal(true);
    };

    const closeTaskModal = () => {
        setShowTaskModal(false);
        setSelectedTask(null);
    };

    const openDetailModal = (task) => {
        setSelectedTask(task);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedTask(null);
    };

    const handleProfileSave = async (payload) => {
        setIsSavingProfile(true);
        try {
            const updatedUser = await authService.updateProfile(payload);
            onUserUpdate(updatedUser);
            showNotification('Profile updated successfully.');
            setShowProfilePanel(false);
        } catch (error) {
            showNotification(error.response?.data?.message || error.response?.data || 'Failed to update profile', 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const stats = getTaskStats(tasks);
    const { total, inProgress, completed } = stats;
    const selectedDateKey = selectedDate.toISOString().split('T')[0];
    const tasksForSelectedDate = tasks.filter((task) => task.dueDate === selectedDateKey);
    const totalTasksSafe = total || 1;
    const statProgress = {
        total: 100,
        inProgress: Math.min(100, Math.round((inProgress / totalTasksSafe) * 100)),
        completed: Math.min(100, Math.round((completed / totalTasksSafe) * 100))
    };

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setAnimatedStats({ total, inProgress, completed });
            return;
        }

        let frame;
        const duration = 900;
        const start = performance.now();
        const from = { total: 0, inProgress: 0, completed: 0 };

        const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedStats({
                total: Math.round(from.total + (total - from.total) * eased),
                inProgress: Math.round(from.inProgress + (inProgress - from.inProgress) * eased),
                completed: Math.round(from.completed + (completed - from.completed) * eased)
            });
            if (progress < 1) {
                frame = window.requestAnimationFrame(animate);
            }
        };

        frame = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(frame);
    }, [total, inProgress, completed]);

    return (
        <div className={`dashboard-shell min-h-screen transition-colors duration-300 ${
            darkMode
                ? 'dark bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#020617]'
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>
            <div className="dashboard-background" aria-hidden="true">
                <div className="dashboard-orb orb-left" />
                <div className="dashboard-orb orb-right" />
            </div>

            {/* HEADER */}
            <header className="dashboard-header sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-black/40 border-b border-gray-200/50 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-5">

                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowProfilePanel(true)}
                                className="flex items-center justify-center h-12 w-12 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/10 shadow-sm hover:shadow-md"
                                aria-label="Open profile settings"
                            >
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="h-11 w-11 rounded-2xl object-cover"
                                    />
                                ) : (
                                    <UserCircle className="w-7 h-7 text-indigo-500" />
                                )}
                            </button>
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                                <Check className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Welcome back, {user?.username || 'User'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <LiveClock />

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:scale-105 transition"
                            >
                                {darkMode ? <Sun /> : <Moon />}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white transition"
                            >
                                <LogOut />
                            </button>
                        </div>
                    </div>

                    {/* SEARCH & FILTERS */}
                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="relative flex-1 min-w-[260px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border dark:border-white/10"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border dark:border-white/10"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <button
                            onClick={() => openTaskModal()}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow hover:scale-105 transition flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> New Task
                        </button>

                        <button
                            onClick={handleDownloadReport}
                            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center gap-2"
                        >
                            <Calendar className="w-5 h-5" /> Download Report
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="dashboard-main max-w-7xl mx-auto px-6 py-12">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { key: 'total', label: 'Total Tasks', value: animatedStats.total, accent: 'from-indigo-500 to-purple-500' },
                        { key: 'inProgress', label: 'In Progress', value: animatedStats.inProgress, accent: 'from-sky-500 to-indigo-500' },
                        { key: 'completed', label: 'Completed', value: animatedStats.completed, accent: 'from-emerald-500 to-green-500' },
                    ].map((card, index) => (
                        <div
                            key={card.label}
                            className="dashboard-card p-5 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 shadow-lg"
                            style={{ animationDelay: `${index * 120}ms` }}
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-3xl font-semibold text-gray-900 dark:text-white">{card.value}</span>
                                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${card.accent}`} />
                            </div>
                            <div className="mt-4 h-2 w-full rounded-full bg-gray-200/70 dark:bg-white/10 overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${card.accent} stat-progress`}
                                    style={{ width: `${statProgress[card.key]}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </section>

                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Tasks</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Browse tasks in a list or calendar view.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                                viewMode === 'list'
                                    ? 'bg-indigo-600 text-white border-indigo-600 active-glow'
                                    : 'border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                        >
                            <List className="w-4 h-4" /> List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                                viewMode === 'calendar'
                                    ? 'bg-indigo-600 text-white border-indigo-600 active-glow'
                                    : 'border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Calendar
                        </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <>
                        {loading ? (
                            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-10 text-center text-gray-500 dark:text-gray-400">
                                Loading tasks...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                {currentTasks.map((task, index) => (
                                    <div
                                        key={task.id}
                                        className="dashboard-card"
                                        style={{ animationDelay: `${index * 80}ms` }}
                                    >
                                        <TaskCard
                                            task={task}
                                            onClick={() => openDetailModal(task)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-14">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-40"
                                >
                                    <ChevronLeft />
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                            currentPage === i + 1
                                                ? 'bg-indigo-600 text-white'
                                                : 'hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-40"
                                >
                                    <ChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-8">
                        <CalendarView
                            tasks={tasks}
                            selectedDate={selectedDate}
                            currentMonth={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            onDateSelect={setSelectedDate}
                        />
                        <div className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tasks for</p>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                            </div>
                            {loading ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Loading tasks...</p>
                            ) : tasksForSelectedDate.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No tasks scheduled for this date.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {tasksForSelectedDate.map((task) => (
                                        <button
                                            key={task.id}
                                            onClick={() => openDetailModal(task)}
                                            className="w-full text-left p-4 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md"
                                        >
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {task.taskName}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {task.description || 'No description'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {showTaskModal && (
                <TaskModal
                    task={selectedTask}
                    onClose={closeTaskModal}
                    onSuccess={() => {
                        fetchTasks();
                        closeTaskModal();
                    }}
                    showNotification={showNotification}
                />
            )}

            {showDetailModal && selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={closeDetailModal}
                    onEdit={() => {
                        closeDetailModal();
                        openTaskModal(selectedTask);
                    }}
                    onDelete={async () => {
                        await taskService.deleteTask(selectedTask.id);
                        fetchTasks();
                        closeDetailModal();
                    }}
                />
            )}

            {showProfilePanel && (
                <ProfilePanel
                    user={user}
                    onClose={() => setShowProfilePanel(false)}
                    onSave={handleProfileSave}
                    isSaving={isSavingProfile}
                />
            )}
        </div>
    );
};

export default Dashboard;
