import React from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
    const renderMessage = () => {
        if (message == null) {
            return '';
        }
        if (typeof message === 'string' || typeof message === 'number') {
            return message;
        }
        if (typeof message === 'object' && 'message' in message) {
            return message.message;
        }
        try {
            return JSON.stringify(message);
        } catch (error) {
            return 'An unexpected error occurred.';
        }
    };
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={`
                fixed top-5 right-5 z-50
                max-w-sm
                px-5 py-4
                rounded-xl
                shadow-2xl
                border
                backdrop-blur-md
                transition-all duration-300
                animate-in slide-in-from-top-4 fade-in
                ${
                type === 'error'
                    ? 'bg-red-500/90 border-red-400'
                    : 'bg-emerald-500/90 border-emerald-400'
            }
                text-white
            `}
        >
            <p className="text-sm font-semibold leading-snug">
                {renderMessage()}
            </p>
        </div>
    );
};

export default Notification;
