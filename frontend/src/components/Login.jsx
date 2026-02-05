import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const Login = ({ onLoginSuccess, onSwitchToRegister, darkMode, showNotification }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login(
                formData.username,
                formData.password
            );
            showNotification('Login successful!');
            onLoginSuccess(response);
        } catch (error) {
            showNotification(error.response?.data || 'Invalid credentials', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* LEFT — FORM */}
            <div className="w-full lg:w-[40%] flex items-center justify-center px-10 bg-white dark:bg-gray-900 z-10">
                <div className="w-full max-w-md animate-in fade-in zoom-in-95">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-10">
                        Focus. Organize. Get things done.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-black transition shadow-sm"
                        />

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                disabled={loading}
                                className="w-full px-6 py-4 pr-16 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-black transition shadow-sm"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="text-right text-sm text-gray-500 hover:underline cursor-pointer">
                            Forgot Password?
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-full font-semibold shadow-lg hover:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Signing in…' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 text-sm">
                        Not a member?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="font-semibold text-black dark:text-white hover:underline"
                        >
                            Register now
                        </button>
                    </p>
                </div>
            </div>

            {/* RIGHT — PREMIUM ABSTRACT PANEL */}
            <div className="hidden lg:flex w-[60%] relative items-center justify-center bg-[#F5FBF7] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden">

                {/* Animated gradient blobs */}
                <div className="absolute w-[500px] h-[500px] bg-emerald-300/40 rounded-full blur-[120px] top-[-120px] left-[-120px] animate-pulse" />
                <div className="absolute w-[420px] h-[420px] bg-lime-300/40 rounded-full blur-[120px] bottom-[-120px] right-[-120px] animate-pulse delay-1000" />
                <div className="absolute w-[300px] h-[300px] bg-green-300/40 rounded-full blur-[100px] top-1/3 right-1/4 animate-pulse delay-500" />

                {/* Content */}
                <div className="relative z-10 max-w-lg text-center px-12">
                    {/* Glass Card */}
                    <div className="backdrop-blur-2xl bg-white/70 dark:bg-gray-900/60 rounded-3xl shadow-2xl p-10 mb-12 border border-white/40 dark:border-gray-700">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">
                                ✓
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                    Productivity
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Tasks in sync
                                </p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="relative w-28 h-28 mx-auto">
                            <div className="absolute inset-0 rounded-full border-[10px] border-emerald-200 dark:border-emerald-900"></div>
                            <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 border-t-transparent rotate-[120deg]"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-emerald-600">
                                84%
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                        Make your work effortless
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Organize tasks, track progress, and stay focused with a clean,
                        distraction-free experience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
