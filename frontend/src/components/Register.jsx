import React, { useMemo, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const Register = ({ onRegisterSuccess, onSwitchToLogin, showNotification }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    const triggerErrorAnimation = () => {
        setFormError(true);
        setTimeout(() => setFormError(false), 700);
    };

    const triggerSuccessState = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onRegisterSuccess();
        }, 900);
    };

    const validityTone = useMemo(() => {
        if (!formData.username && !formData.email && !formData.password) return 'neutral';
        if (
            formData.username &&
            /\S+@\S+\.\S+/.test(formData.email) &&
            formData.password.length >= 6
        ) {
            return 'valid';
        }
        return 'warn';
    }, [formData]);

    /* ------------------ PARALLAX ------------------ */
    const handleParallax = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        containerRef.current.style.setProperty('--mx', x.toFixed(3));
        containerRef.current.style.setProperty('--my', y.toFixed(3));
    };

    const resetParallax = () => {
        if (!containerRef.current) return;
        containerRef.current.style.setProperty('--mx', '0');
        containerRef.current.style.setProperty('--my', '0');
    };

    /* ------------------ MAGNETIC BUTTON ------------------ */
    const handleMagneticMove = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        buttonRef.current.style.setProperty('--btn-x', `${x * 0.2}px`);
        buttonRef.current.style.setProperty('--btn-y', `${y * 0.2}px`);
    };

    const resetMagnetic = () => {
        if (!buttonRef.current) return;
        buttonRef.current.style.setProperty('--btn-x', '0px');
        buttonRef.current.style.setProperty('--btn-y', '0px');
    };

    /* ------------------ SUBMIT ------------------ */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            showNotification('Please fill in all fields', 'error');
            triggerErrorAnimation();
            return;
        }

        if (formData.password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            triggerErrorAnimation();
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
            triggerSuccessState();
        } catch (error) {
            const errorMessage = error.response?.data || 'Registration failed';
            showNotification(
                errorMessage.toLowerCase().includes('exists')
                    ? 'User already exists'
                    : errorMessage,
                'error'
            );
            triggerErrorAnimation();
        } finally {
            setLoading(false);
        }
    };

    const passwordScore = Math.min(100, (formData.password.length / 12) * 100);
    const passwordLabel =
        formData.password.length === 0
            ? 'Enter a password'
            : formData.password.length < 6
                ? 'Weak'
                : formData.password.length < 10
                    ? 'Good'
                    : 'Strong';

    return (
        <div
            ref={containerRef}
            onMouseMove={handleParallax}
            onMouseLeave={resetParallax}
            className={`auth-page auth-page--register auth-motion min-h-screen flex overflow-hidden tone-${validityTone}`}
        >
            {/* BACKGROUND */}
            <div className="auth-canvas" aria-hidden="true">
                <div className="parallax-layer layer-back" />
                <div className="parallax-layer layer-mid" />
                <div className="parallax-layer layer-front" />

                <div className="absolute -top-24 left-8 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl animate-float-slow" />
                <div className="absolute bottom-[-140px] right-12 h-96 w-96 rounded-full bg-indigo-400/25 blur-3xl animate-float-medium" />
                <div className="absolute top-1/3 right-1/3 h-52 w-52 rounded-full bg-emerald-400/20 blur-2xl animate-float-fast" />
            </div>

            {/* REGISTER CARD */}
            <div className="auth-surface w-full flex items-center justify-center px-8 sm:px-10">
                <div className={`auth-card w-full max-w-md ${formError ? 'shake-error' : ''}`}>
                    <div className="mb-8">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-sky-200">
                            Create Access
                        </span>
                    </div>

                    <h1 className="text-4xl font-semibold text-white mb-3">
                        Create account
                    </h1>
                    <p className="text-sm text-slate-200 mb-10">
                        Start organizing your work in one place.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="floating-field">
                            <input
                                id="register-username"
                                type="text"
                                placeholder=" "
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                disabled={loading}
                                className="floating-input floating-input--dark"
                            />
                            <label htmlFor="register-username" className="floating-label floating-label--dark">
                                Username
                            </label>
                        </div>

                        {/* Email */}
                        <div className="floating-field">
                            <input
                                id="register-email"
                                type="email"
                                placeholder=" "
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                disabled={loading}
                                className="floating-input floating-input--dark"
                            />
                            <label htmlFor="register-email" className="floating-label floating-label--dark">
                                Email
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="floating-field">
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder=" "
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    disabled={loading}
                                    className="floating-input floating-input--dark pr-16"
                                />
                                <label htmlFor="register-password" className="floating-label floating-label--dark">
                                    Password
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Password Meter */}
                        <div className="password-meter">
                            <div className="flex justify-between text-xs text-slate-200 mb-2">
                                <span>Password strength</span>
                                <span className="font-semibold">{passwordLabel}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 transition-[width] duration-500"
                                    style={{ width: `${passwordScore}%` }}
                                />
                            </div>
                        </div>

                        <button
                            ref={buttonRef}
                            onMouseMove={handleMagneticMove}
                            onMouseLeave={resetMagnetic}
                            type="submit"
                            disabled={loading}
                            className="magnetic-button w-full py-4 rounded-full font-semibold shadow-lg disabled:opacity-50"
                            style={{ background: 'linear-gradient(120deg, #38bdf8, #6366f1)' }}
                        >
                            {loading ? 'Creating account…' : showSuccess ? 'Success!' : 'Create account'}
                        </button>
                    </form>

                    {showSuccess && (
                        <div className="success-message success-message--dark mt-6">
                            <div className="success-check">✓</div>
                            <p>Account created. Redirecting to login…</p>
                        </div>
                    )}

                    <p className="mt-8 text-center text-slate-200 text-sm">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="font-semibold text-white hover:text-sky-200 hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
