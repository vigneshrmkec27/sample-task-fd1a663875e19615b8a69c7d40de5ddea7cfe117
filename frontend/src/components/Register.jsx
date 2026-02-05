import React, { useMemo, useRef, useState } from 'react';
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
            </div>

            {/* LEFT — REGISTER FORM */}
            <div className="auth-surface w-full flex items-center justify-center px-8 sm:px-10">
                <div className={`auth-card w-full max-w-md ${formError ? 'shake-error' : ''}`}>
                    <h1 className="text-4xl font-semibold mb-3">Create account</h1>
                    <p className="text-sm text-muted mb-10">
                        Start organizing your work in one place.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="floating-field">
                            <input
                                type="text"
                                placeholder=" "
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                disabled={loading}
                                className="floating-input"
                            />
                            <label className="floating-label">Username</label>
                        </div>

                        <div className="floating-field">
                            <input
                                type="email"
                                placeholder=" "
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                disabled={loading}
                                className="floating-input"
                            />
                            <label className="floating-label">Email</label>
                        </div>

                        <div className="relative">
                            <div className="floating-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder=" "
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    disabled={loading}
                                    className="floating-input pr-16"
                                />
                                <label className="floating-label">Password</label>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="password-meter">
                            <div className="flex justify-between text-xs mb-2">
                                <span>Password strength</span>
                                <span className="font-semibold">{passwordLabel}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
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
                            className="btn-primary magnetic-button"
                        >
                            {loading ? 'Creating account…' : showSuccess ? 'Success!' : 'Create account'}
                        </button>
                    </form>

                    {showSuccess && (
                        <div className="success-message mt-6">
                            <div className="success-check">✓</div>
                            <p>Account created. Redirecting to login…</p>
                        </div>
                    )}

                    <p className="mt-8 text-center text-sm">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="link">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
