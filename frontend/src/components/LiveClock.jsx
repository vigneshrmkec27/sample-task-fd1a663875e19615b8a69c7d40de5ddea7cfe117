import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LiveClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="
                flex items-center gap-2
                px-4 py-2
                rounded-xl
                bg-white/70 dark:bg-gray-800/70
                backdrop-blur-md
                border border-gray-200 dark:border-gray-700
                shadow-sm
                hover:shadow-md
                transition-all
            "
            aria-label="Current time"
        >
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />

            <span className="font-mono text-sm font-semibold tracking-wide text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                })}
            </span>
        </div>
    );
};

export default LiveClock;
