import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { taskService } from '../services/taskService';

const TaskModal = ({ task, onClose, onSuccess, showNotification }) => {
    const [formData, setFormData] = useState({
        taskName: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: '',
        reminderTime: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                taskName: task.taskName,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
                reminderTime: task.reminderTime || ''
            });
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.taskName || !formData.description || !formData.dueDate) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setLoading(true);
        try {
            if (task) {
                await taskService.updateTask(task.id, formData);
                showNotification('Task updated!');
            } else {
                await taskService.createTask(formData);
                showNotification('Task created!');
            }
            onSuccess();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Operation failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                    {/* Task Name */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Task Name *
                        </label>
                        <input
                            type="text"
                            value={formData.taskName}
                            onChange={(e) =>
                                setFormData({ ...formData, taskName: e.target.value })
                            }
                            disabled={loading}
                            maxLength="200"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Description *
                        </label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            disabled={loading}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none shadow-sm"
                        />
                    </div>

                    {/* Priority & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Priority *
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) =>
                                    setFormData({ ...formData, priority: e.target.value })
                                }
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Status *
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value })
                                }
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, dueDate: e.target.value })
                                }
                                disabled={loading}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Reminder Time
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.reminderTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        reminderTime: e.target.value
                                    })
                                }
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
