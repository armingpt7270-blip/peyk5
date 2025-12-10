
import React, { useState } from 'react';
import { User } from '../../types';
import Header from '../../components/common/Header';
import ManageCouriers from './ManageCouriers';
import ManageOrders from './ManageOrders';
import ManageCustomers from './ManageCustomers';
import ChatWidget from '../../components/chat/ChatWidget';
import { Icons } from '../../constants';
import GlassCard from '../../components/common/GlassCard';

interface AdminDashboardProps {
    user: User;
    onLogout: () => void;
}

type ActiveTab = 'couriers' | 'orders' | 'customers';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('couriers');

     const NavItem = ({ tab, label, icon: Icon }: { tab: ActiveTab; label: string; icon: any }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-full text-right px-6 py-4 rounded-xl transition-all flex items-center mb-2 ${
                activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
            }`}
        >
            <Icon className="w-5 h-5 ml-3" />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen p-4 md:p-6 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <GlassCard className="h-full !p-4" noPadding>
                         <div className="mb-8 px-2 pt-2 text-center lg:text-right">
                             <h2 className="text-xl font-black text-gray-800 dark:text-white">پنل مدیریت</h2>
                             <p className="text-xs text-gray-500">نسخه حرفه‌ای v2.0</p>
                         </div>
                         <nav>
                             <NavItem tab="couriers" label="سفیران" icon={Icons.User} />
                             <NavItem tab="customers" label="مشتریان" icon={Icons.Users} />
                             <NavItem tab="orders" label="سفارشات" icon={Icons.Bell} />
                         </nav>
                         
                         <div className="mt-12 px-4">
                             <button onClick={onLogout} className="flex items-center text-red-500 text-sm hover:text-red-600 transition-colors">
                                 <Icons.Logout className="w-4 h-4 ml-2" /> خروج از سیستم
                             </button>
                         </div>
                    </GlassCard>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-4 space-y-6">
                    <Header user={user} onLogout={onLogout} />
                    
                    {/* KPI Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <GlassCard className="flex items-center justify-between !p-5 relative overflow-hidden">
                             <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
                             <div>
                                 <p className="text-gray-500 text-sm">سفارشات امروز</p>
                                 <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">۱۴۲</h3>
                             </div>
                             <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600"><Icons.Bell className="w-6 h-6" /></div>
                         </GlassCard>
                         <GlassCard className="flex items-center justify-between !p-5 relative overflow-hidden">
                             <div className="absolute left-0 top-0 w-1 h-full bg-green-500"></div>
                             <div>
                                 <p className="text-gray-500 text-sm">درآمد کل</p>
                                 <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">۱۲,۵۰۰,۰۰۰</h3>
                             </div>
                             <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600"><Icons.Wallet className="w-6 h-6" /></div>
                         </GlassCard>
                         <GlassCard className="flex items-center justify-between !p-5 relative overflow-hidden">
                             <div className="absolute left-0 top-0 w-1 h-full bg-purple-500"></div>
                             <div>
                                 <p className="text-gray-500 text-sm">سفیران آنلاین</p>
                                 <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">۲۸</h3>
                             </div>
                             <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600"><Icons.User className="w-6 h-6" /></div>
                         </GlassCard>
                    </div>

                    <div className="transition-all duration-300">
                        {activeTab === 'couriers' && <ManageCouriers user={user} />}
                        {activeTab === 'customers' && <ManageCustomers />}
                        {activeTab === 'orders' && <ManageOrders />}
                    </div>
                </div>
            </div>
            
            {/* Global Chat Widget */}
            <ChatWidget />
        </div>
    );
};

export default AdminDashboard;
