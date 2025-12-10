
import React, { useState } from 'react';
import { User } from '../../types';
import Header from '../../components/common/Header';
import GlassCard from '../../components/common/GlassCard';
import OrderList from './OrderList';
import WalletView from './WalletView';
import ChatWidget from '../../components/chat/ChatWidget';
import { Icons } from '../../constants';

interface CourierDashboardProps {
    user: User;
    onLogout: () => void;
}

type ActiveTab = 'orders' | 'wallet';

const CourierDashboard: React.FC<CourierDashboardProps> = ({ user, onLogout }) => {
    const [isOnline, setIsOnline] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('orders');

    const TabButton = ({ tab, label, icon: Icon }: { tab: ActiveTab; label: string; icon: any }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105' 
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
            }`}
        >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen p-4 pb-24 md:pb-6 max-w-5xl mx-auto">
            <Header user={user} onLogout={onLogout} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar / Status Card */}
                <div className="md:col-span-1 space-y-6">
                    <GlassCard className="text-center relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-full h-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">وضعیت فعالیت</h3>
                        <div className="mt-4 flex justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={isOnline} onChange={() => setIsOnline(!isOnline)} />
                                <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>
                        <p className={`mt-3 font-bold text-lg ${isOnline ? 'text-green-600' : 'text-red-500'}`}>
                            {isOnline ? 'آنلاین و آماده کار' : 'آفلاین'}
                        </p>
                    </GlassCard>

                    {/* Stats Summary */}
                    <GlassCard>
                         <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">آمار امروز</h4>
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-sm text-gray-500">سفارشات:</span>
                             <span className="font-bold text-gray-800 dark:text-white">۵</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-gray-500">درآمد:</span>
                             <span className="font-bold text-green-600">۸۵۰,۰۰۰ تومان</span>
                         </div>
                    </GlassCard>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-col space-y-3">
                         <button onClick={() => setActiveTab('orders')} className={`text-right p-4 rounded-xl transition-all flex items-center ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                             <Icons.Home className="w-5 h-5 ml-3" /> سفارشات
                         </button>
                         <button onClick={() => setActiveTab('wallet')} className={`text-right p-4 rounded-xl transition-all flex items-center ${activeTab === 'wallet' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                             <Icons.Wallet className="w-5 h-5 ml-3" /> کیف پول
                         </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-2">
                    <div className="transition-all duration-500 ease-in-out">
                        {activeTab === 'orders' && <OrderList courierId={user.id} />}
                        {activeTab === 'wallet' && <WalletView />}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-4 left-4 right-4 md:hidden bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl flex justify-between gap-2 z-50">
                <TabButton tab="orders" label="سفارشات" icon={Icons.Home} />
                <TabButton tab="wallet" label="کیف پول" icon={Icons.Wallet} />
            </div>

            <ChatWidget />
        </div>
    );
};

export default CourierDashboard;
