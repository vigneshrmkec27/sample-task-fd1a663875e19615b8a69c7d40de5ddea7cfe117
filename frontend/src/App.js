import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import { authService } from './services/authService';

function App() {
    const [currentView, setCurrentView] = useState('login');
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('darkMode') === 'true'
    );
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && authService.isAuthenticated()) {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setCurrentView('dashboard');
        } catch (error) {
            console.error('Error fetching user:', error);
            authService.logout();
            setCurrentView('login');
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleLoginSuccess = async (response) => {
        setUser({ username: response.username, email: response.email, profileImage: response.profileImage });
        await fetchUserData();
        setCurrentView('dashboard');
    };

    const handleRegisterSuccess = () => {
        setCurrentView('login');
    };

    const isAuthView = currentView === 'login' || currentView === 'register';

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Global Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* View Container */}
            <div className="min-h-screen transition-opacity duration-300 ease-in-out">
                {isAuthView && (
                    <div className={`auth-shell ${currentView === 'register' ? 'is-register' : 'is-login'}`}>
                        <div className="auth-panel auth-panel--login" aria-hidden={currentView !== 'login'}>
                            <Login
                                onLoginSuccess={handleLoginSuccess}
                                onSwitchToRegister={() => setCurrentView('register')}
                                darkMode={darkMode}
                                showNotification={showNotification}
                            />
                        </div>
                        <div className="auth-panel auth-panel--register" aria-hidden={currentView !== 'register'}>
                            <Register
                                onRegisterSuccess={handleRegisterSuccess}
                                onSwitchToLogin={() => setCurrentView('login')}
                                darkMode={darkMode}
                                showNotification={showNotification}
                            />
                        </div>
                    </div>
                )}

                {currentView === 'dashboard' && user && (
                    <Dashboard
                        user={user}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        showNotification={showNotification}
                        onUserUpdate={setUser}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
