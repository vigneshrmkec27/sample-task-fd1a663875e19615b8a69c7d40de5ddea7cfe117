import React, { useMemo, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const Login = ({ onLoginSuccess, onSwitchToRegister, darkMode, showNotification }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState(false);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    const triggerErrorAnimation = () => {
        setFormError(true);
        window.setTimeout(() => setFormError(false), 700);
    };

    const validityTone = useMemo(() => {
        if (!formData.username && !formData.password) return 'neutral';
        if (formData.username && formData.password.length >= 6) return 'valid';
        return 'warn';
    }, [formData.password, formData.username]);

    const handleParallax = (event) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        containerRef.current.style.setProperty('--mx', x.toFixed(3));
        containerRef.current.style.setProperty('--my', y.toFixed(3));
    };

    const resetParallax = () => {
        if (!containerRef.current) return;
        containerRef.current.style.setProperty('--mx', '0');
        containerRef.current.style.setProperty('--my', '0');
    };

    const handleMagneticMove = (event) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const strength = 0.2;
        buttonRef.current.style.setProperty('--btn-x', `${x * strength}px`);
        buttonRef.current.style.setProperty('--btn-y', `${y * strength}px`);
    };

    const resetMagnetic = () => {
        if (!buttonRef.current) return;
        buttonRef.current.style.setProperty('--btn-x', '0px');
        buttonRef.current.style.setProperty('--btn-y', '0px');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            showNotification('Please fill in all fields', 'error');
            triggerErrorAnimation();
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
            triggerErrorAnimation();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleParallax}
            onMouseLeave={resetParallax}
            className={`auth-page auth-page--login auth-motion min-h-screen flex overflow-hidden tone-${validityTone}`}
        >
            <div className="auth-canvas" aria-hidden="true">
                <div className="parallax-layer layer-back" />
                <div className="parallax-layer layer-mid" />
                <div className="parallax-layer layer-front" />
                <div className="absolute -top-20 -right-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl animate-float-slow" />
                <div className="absolute bottom-[-120px] left-10 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl animate-float-medium" />
                <div className="absolute top-1/3 left-1/2 h-52 w-52 rounded-full bg-indigo-400/20 blur-2xl animate-float-fast" />
            </div>
            {/* LEFT — FORM */}
            <div className="auth-surface w-full flex items-center justify-center px-8 sm:px-10">
                <div className={`login-card auth-card w-full max-w-md ${formError ? 'shake-error' : ''}`}>
                    <div className="mb-8">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200/90 animate-fadeIn">
                            Secure Login
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-3 tracking-tight animate-fadeIn">
                        Welcome back
                    </h1>
                    <p className="text-sm sm:text-base text-slate-200/90 mb-10 leading-relaxed animate-fadeIn">
                        Focus. Organize. Get things done.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="floating-field">
                            <input
                                id="login-username"
                                type="text"
                                placeholder=" "
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                disabled={loading}
                                className="floating-input floating-input--dark"
                            />
                            <label htmlFor="login-username" className="floating-label floating-label--dark">
                                Username
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="floating-field">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder=" "
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    disabled={loading}
                                    className="floating-input floating-input--dark pr-16"
                                />
                                <label htmlFor="login-password" className="floating-label floating-label--dark">
                                    Password
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="text-right text-sm text-slate-200/80 hover:text-white hover:underline cursor-pointer">
                            Forgot Password?
                        </div>

                        <button
                            ref={buttonRef}
                            onMouseMove={handleMagneticMove}
                            onMouseLeave={resetMagnetic}
                            type="submit"
                            disabled={loading}
                            className="btn-primary btn-primary--dark w-full py-4 rounded-full font-semibold shadow-lg disabled:opacity-50 magnetic-button"
                            style={{ background: 'linear-gradient(120deg, #34d399, #38bdf8)' }}
                        >
                            {loading ? 'Signing in…' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-200/80 text-sm">
                        Not a member?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="font-semibold text-white hover:text-emerald-200 hover:underline"
                        >
                            Register now
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
