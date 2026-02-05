import React from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { getPriorityColor, getStatusColor, formatDate, formatDateTime } from '../utils/helpers';

const TaskDetail = ({ task, onClose, onEdit, onDelete }) => {
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Task Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        aria-label="Close details"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Title & Badges */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
                            {task.taskName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`
                                    px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                                    ${getStatusColor(task.status)}
                                `}
                            >
                                {task.status.replace('_', ' ')}
                            </span>

                            <span
                                className={`
                                    px-3 py-1 rounded-full text-xs font-bold tracking-wide text-white
                                    ${getPriorityColor(task.priority)}
                                `}
                            >
                                {task.priority}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Description
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Created Date
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                                {formatDateTime(task.createdDate)}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Updated Date
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                                {formatDateTime(task.updatedDate)}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Due Date
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                                {formatDate(task.dueDate)}
                            </p>
                        </div>

                        {task.reminderTime && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    Reminder
                                </h4>
                                <p className="text-gray-900 dark:text-white">
                                    {formatDateTime(task.reminderTime)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={onEdit}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all hover:scale-[0.98]"
                        >
                            <Edit2 className="w-5 h-5" />
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold shadow-lg transition-all hover:scale-[0.98]"
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
