export const getPriorityColor = (priority) => {
    if (!priority) return 'bg-gray-500';

    switch (priority.toUpperCase()) {
        case 'HIGH':
            return 'bg-red-500';
        case 'MEDIUM':
            return 'bg-yellow-500';
        case 'LOW':
            return 'bg-green-500';
        default:
            return 'bg-gray-500';
    }
};

export const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

    switch (status.toUpperCase()) {
        case 'COMPLETED':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'IN_PROGRESS':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

export const formatDate = (date) => {
    if (!date) return 'No date';

    try {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (error) {
        return 'Invalid date';
    }
};

export const formatDateTime = (date) => {
    if (!date) return 'No date';

    try {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        return 'Invalid date';
    }
};

export const getTaskStats = (tasks) => {
    // Handle null, undefined, or non-array inputs
    if (!tasks || !Array.isArray(tasks)) {
        return {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
        };
    }

    return {
        total: tasks.length,
        pending: tasks.filter(t => t && t.status === 'PENDING').length,
        inProgress: tasks.filter(t => t && t.status === 'IN_PROGRESS').length,
        completed: tasks.filter(t => t && t.status === 'COMPLETED').length,
    };
};