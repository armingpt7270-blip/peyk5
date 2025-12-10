
import React, { useState } from 'react';
import { Courier, CourierStatus, User, Role } from '../../types';
import { MOCK_COURIERS } from '../../constants';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Icons } from '../../constants';

const getStatusClass = (status: CourierStatus) => {
    switch (status) {
        case CourierStatus.APPROVED: return 'bg-green-100 text-green-800 border-green-200';
        case CourierStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case CourierStatus.INACTIVE: return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800';
    }
};

interface ManageCouriersProps {
    user: User;
}

const ManageCouriers: React.FC<ManageCouriersProps> = ({ user }) => {
    const [couriers, setCouriers] = useState<Courier[]>(MOCK_COURIERS);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // New Courier Form State
    const [newCourier, setNewCourier] = useState({
        fullName: '',
        username: '',
        password: '',
        nationalId: '',
        phone: '',
        address: ''
    });

    const handleStatusChange = (courierId: string, newStatus: CourierStatus) => {
        setCouriers(prev => prev.map(c => c.id === courierId ? { ...c, status: newStatus } : c));
    };

    const handleDelete = (courierId: string) => {
        if(window.confirm('آیا از حذف این سفیر اطمینان دارید؟')) {
            setCouriers(prev => prev.filter(c => c.id !== courierId));
        }
    };

    const handleAddCourier = (e: React.FormEvent) => {
        e.preventDefault();
        const createdCourier: Courier = {
            id: `new_${Date.now()}`,
            role: Role.COURIER,
            status: CourierStatus.APPROVED,
            isOnline: false,
            location: { lat: 35.6892, lng: 51.3890 }, // Default Tehran
            ...newCourier
        };
        setCouriers([...couriers, createdCourier]);
        setShowAddModal(false);
        setNewCourier({ fullName: '', username: '', password: '', nationalId: '', phone: '', address: '' });
    };

    return (
        <GlassCard>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">مدیریت ناوگان سفیران</h2>
                <Button className="text-sm flex items-center" onClick={() => setShowAddModal(true)}>
                    <Icons.Plus className="w-5 h-5 ml-1" /> افزودن سفیر جدید
                </Button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" className="py-4 px-4 text-right text-sm font-bold text-gray-900 dark:text-white">نام و نام خانوادگی</th>
                            <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">شماره تماس</th>
                            <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">وضعیت</th>
                            <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">وضعیت آنلاین</th>
                            <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-transparent">
                        {couriers.map((courier) => (
                            <tr key={courier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs ml-3">
                                            {courier.username.charAt(0).toUpperCase()}
                                        </div>
                                        {courier.fullName}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono" dir="ltr">{courier.phone}</td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClass(courier.status)}`}>
                                        {courier.status}
                                    </span>
                                </td>
                                 <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className={`flex items-center ${courier.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                                        <div className={`h-2.5 w-2.5 rounded-full ml-2 ${courier.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                        {courier.isOnline ? 'آنلاین' : 'آفلاین'}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <a href={`tel:${courier.phone}`} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" title="تماس با سفیر">
                                            <Icons.Phone className="w-4 h-4" />
                                        </a>
                                        {courier.status === CourierStatus.PENDING && (
                                            <Button variant="primary" onClick={() => handleStatusChange(courier.id, CourierStatus.APPROVED)} className="!text-xs !py-1 !px-2 bg-green-600 hover:bg-green-700">تایید</Button>
                                        )}
                                        {courier.status === CourierStatus.APPROVED && (
                                            <Button variant="secondary" onClick={() => handleStatusChange(courier.id, CourierStatus.INACTIVE)} className="!text-xs !py-1 !px-2">غیرفعال</Button>
                                        )}
                                        {courier.status === CourierStatus.INACTIVE && (
                                            <Button variant="primary" onClick={() => handleStatusChange(courier.id, CourierStatus.APPROVED)} className="!text-xs !py-1 !px-2">فعال‌سازی</Button>
                                        )}
                                        <Button variant="danger" onClick={() => handleDelete(courier.id)} className="!text-xs !py-1 !px-2">
                                            <Icons.Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Courier Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-lg relative">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 left-4 text-gray-500 hover:text-red-500">
                            <Icons.Close className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">ثبت نام سفیر جدید</h3>
                        <form onSubmit={handleAddCourier} className="space-y-4">
                            <Input label="نام و نام خانوادگی" value={newCourier.fullName} onChange={e => setNewCourier({...newCourier, fullName: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="نام کاربری" value={newCourier.username} onChange={e => setNewCourier({...newCourier, username: e.target.value})} required dir="ltr" />
                                <Input label="رمز عبور" type="password" value={newCourier.password} onChange={e => setNewCourier({...newCourier, password: e.target.value})} required dir="ltr" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="کد ملی" value={newCourier.nationalId} onChange={e => setNewCourier({...newCourier, nationalId: e.target.value})} required />
                                <Input label="شماره موبایل" value={newCourier.phone} onChange={e => setNewCourier({...newCourier, phone: e.target.value})} required />
                            </div>
                            <Input label="آدرس سکونت" value={newCourier.address} onChange={e => setNewCourier({...newCourier, address: e.target.value})} required />
                            
                            <div className="flex gap-4 mt-6">
                                <Button type="submit" className="flex-1">ثبت اطلاعات سفیر</Button>
                                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">انصراف</Button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}
        </GlassCard>
    );
};

export default ManageCouriers;