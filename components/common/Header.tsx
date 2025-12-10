
import React from 'react';
import { User } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../../constants';
import GlassCard from './GlassCard';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <GlassCard className="mb-6 !p-4" noPadding>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">سامانه هوشمند پیک</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">خوش آمدید، {user.fullName}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full bg-gray-100/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors shadow-sm"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Icons.Moon className="h-5 w-5" /> : <Icons.Sun className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200 shadow-sm"
                    >
                        <Icons.Logout className="h-5 w-5" />
                        <span className="text-sm font-medium hidden md:inline">خروج</span>
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

export default Header;
