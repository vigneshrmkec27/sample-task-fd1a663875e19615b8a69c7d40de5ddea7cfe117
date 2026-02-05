import React from 'react';
import { Calendar } from 'lucide-react';
import { getPriorityColor, getStatusColor, formatDate } from '../utils/helpers';

const TaskCard = ({ task, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="
                group relative
                bg-white dark:bg-gray-800
                rounded-2xl
                border border-gray-200/80 dark:border-gray-700/80
                shadow-[0_2px_6px_rgba(0,0,0,0.05)]
                hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]
                transition-all duration-200 ease-out
                hover:-translate-y-0.5
                cursor-pointer
                overflow-hidden
                focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900
            "
        >
            {/* Priority Accent */}
            <div
                className={`h-1 ${getPriorityColor(task.priority)} opacity-90`}
            />

            <div className="p-5 flex flex-col h-full">
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                        {task.taskName}
                    </h3>

                    <span
                        className={`
                            px-2.5 py-1
                            rounded-full
                            text-[10px]
                            font-semibold
                            tracking-wide
                            whitespace-nowrap
                            ${getStatusColor(task.status)}
                        `}
                    >
                        {task.status.replace('_', ' ')}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4">
                    {task.description}
                </p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 opacity-80" />
                        <span>{formatDate(task.dueDate)}</span>
                    </div>

                    <div
                        className={`
                            px-2.5 py-1
                            rounded-md
                            text-white
                            text-[10px]
                            font-bold
                            tracking-wide
                            ${getPriorityColor(task.priority)}
                        `}
                    >
                        {task.priority}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
