
import React, { useState, useEffect, useMemo } from 'react';
import { User, Role } from './types';
import LoginScreen from './pages/LoginScreen';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourierDashboard from './pages/courier/CourierDashboard';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const AppView = () => {
        if (!user) {
            return <LoginScreen onLogin={handleLogin} />;
        }

        switch (user.role) {
            case Role.ADMIN:
            case Role.ROOT_ADMIN:
                return <AdminDashboard user={user} onLogout={handleLogout} />;
            case Role.COURIER:
                return <CourierDashboard user={user} onLogout={handleLogout} />;
            default:
                return <LoginScreen onLogin={handleLogin} />;
        }
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen w-full font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-x-hidden" dir="rtl">
                {/* Background Blobs for modern feel */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative z-10">
                    <AppView />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
