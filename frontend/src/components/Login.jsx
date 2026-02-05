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
        setTimeout(() => setFormError(false), 700);
    };

    const validityTone = useMemo(() => {
        if (!formData.username && !formData.password) return 'neutral';
        if (formData.username && formData.password.length >= 6) return 'valid';
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
            {/* BACKGROUND */}
            <div className="auth-canvas" aria-hidden="true">
                <div className="parallax-layer layer-back" />
                <div className="parallax-layer layer-mid" />
                <div className="parallax-layer layer-front" />
            </div>

            {/* LEFT — LOGIN FORM */}
            <div className="auth-surface w-full flex items-center justify-center px-8 sm:px-10">
                <div className={`login-card auth-card w-full max-w-md ${formError ? 'shake-error' : ''}`}>
                    <div className="mb-8">
                        <span className="badge">Secure Login</span>
                    </div>

                    <h1 className="text-4xl font-semibold mb-3">Welcome back</h1>
                    <p className="text-sm text-muted mb-10">
                        Focus. Organize. Get things done.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
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

                        {/* Password */}
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

                        <button
                            ref={buttonRef}
                            onMouseMove={handleMagneticMove}
                            onMouseLeave={resetMagnetic}
                            type="submit"
                            disabled={loading}
                            className="btn-primary magnetic-button"
                        >
                            {loading ? 'Signing in…' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm">
                        Not a member?{' '}
                        <button onClick={onSwitchToRegister} className="link">
                            Register now
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
