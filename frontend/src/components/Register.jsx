import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const Register = ({ onRegisterSuccess, onSwitchToLogin, darkMode, showNotification }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (formData.password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        setLoading(true);
        try {
            await authService.register(
                formData.username,
                formData.email,
                formData.password
            );
            showNotification('Registration successful! Please login.');
            onRegisterSuccess();
        } catch (error) {
            const errorMessage = error.response?.data || 'Registration failed';
            if (errorMessage.toLowerCase().includes('exists')) {
                showNotification('User Already Exists', 'error');
            } else {
                showNotification(errorMessage, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* LEFT — REGISTER FORM */}
            <div className="w-full lg:w-[40%] flex items-center justify-center px-10 bg-white dark:bg-gray-900 z-10">
                <div className="w-full max-w-md animate-in fade-in zoom-in-95">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        Create account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-10">
                        Start organizing your work in one place.
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

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-full font-semibold shadow-lg hover:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="font-semibold text-black dark:text-white hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>

            {/* RIGHT — SAME ABSTRACT PANEL AS LOGIN */}
            <div className="hidden lg:flex w-[60%] relative items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">

                {/* Floating gradient blobs */}
                <div className="absolute w-[500px] h-[500px] bg-emerald-300/40 rounded-full blur-[140px] top-[-120px] left-[-120px] animate-pulse" />
                <div className="absolute w-[420px] h-[420px] bg-lime-300/40 rounded-full blur-[140px] bottom-[-120px] right-[-120px] animate-pulse delay-1000" />
                <div className="absolute w-[300px] h-[300px] bg-green-300/40 rounded-full blur-[120px] top-1/3 right-1/4 animate-pulse delay-500" />

                {/* Content */}
                <div className="relative z-10 max-w-lg text-center px-12">
                    {/* Widget */}
                    <div className="backdrop-blur-2xl bg-white/75 dark:bg-gray-900/60 rounded-3xl shadow-2xl p-10 mb-12 border border-white/40 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Get Started
                                </p>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Build Better Habits
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-emerald-600 font-bold">★</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Task Organization
                                </span>
                                <span className="text-emerald-600 font-semibold">
                                    Enabled
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Reminders
                                </span>
                                <span className="text-emerald-600 font-semibold">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Productivity Mode
                                </span>
                                <span className="text-emerald-600 font-semibold">
                                    On
                                </span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                        Everything you need to stay productive
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Plan smarter, work faster, and keep your focus where it matters.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
