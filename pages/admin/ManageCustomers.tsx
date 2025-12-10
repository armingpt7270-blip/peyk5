
import React, { useState } from 'react';
import { Customer, Address } from '../../types';
import { MOCK_CUSTOMERS, Icons } from '../../constants';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import MapComponent from '../../components/common/MapComponent';

const ManageCustomers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState<{customerId: string} | null>(null);
    
    // New Customer State
    const [newCustomer, setNewCustomer] = useState({ fullName: '', phone: '' });

    // New Address State
    const [newAddress, setNewAddress] = useState<{ title: string; fullAddress: string; location: { lat: number; lng: number } }>({
        title: '',
        fullAddress: '',
        location: { lat: 35.6892, lng: 51.3890 }
    });

    const handleAddCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        const createdCustomer: Customer = {
            id: `cust_${Date.now()}`,
            createdAt: new Date().toISOString(),
            addresses: [],
            ...newCustomer
        };
        setCustomers([...customers, createdCustomer]);
        setShowAddCustomerModal(false);
        setNewCustomer({ fullName: '', phone: '' });
    };

    const handleDeleteCustomer = (id: string) => {
        if (window.confirm('آیا از حذف این مشتری اطمینان دارید؟')) {
            setCustomers(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (!showAddressModal) return;

        const address: Address = {
            id: `addr_${Date.now()}`,
            ...newAddress
        };

        setCustomers(prev => prev.map(c => {
            if (c.id === showAddressModal.customerId) {
                return { ...c, addresses: [...c.addresses, address] };
            }
            return c;
        }));

        setShowAddressModal(null);
        setNewAddress({ title: '', fullAddress: '', location: { lat: 35.6892, lng: 51.3890 } });
    };

    const onMapClick = (lat: number, lng: number) => {
        setNewAddress(prev => ({ ...prev, location: { lat, lng } }));
    };

    return (
        <GlassCard>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">مدیریت مشتریان</h2>
                <Button className="text-sm flex items-center" onClick={() => setShowAddCustomerModal(true)}>
                    <Icons.Plus className="w-5 h-5 ml-1" /> افزودن مشتری جدید
                </Button>
            </div>

            <div className="space-y-4">
                {customers.map(customer => (
                    <GlassCard key={customer.id} className="!p-4 border border-gray-200 dark:border-gray-700" noPadding>
                        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{customer.fullName}</h3>
                                <p className="text-sm text-gray-500 font-mono mt-1">{customer.phone}</p>
                            </div>
                            <div className="flex gap-2 mt-3 md:mt-0">
                                <Button variant="secondary" className="!text-xs" onClick={() => setShowAddressModal({ customerId: customer.id })}>
                                    + افزودن آدرس
                                </Button>
                                <Button variant="danger" className="!text-xs" onClick={() => handleDeleteCustomer(customer.id)}>
                                    <Icons.Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
                            <p className="text-xs text-gray-400 mb-2 font-bold">آدرس‌های ثبت شده:</p>
                            {customer.addresses.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">آدرسی ثبت نشده است.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {customer.addresses.map(addr => (
                                        <li key={addr.id} className="text-sm flex items-center gap-2">
                                            <Icons.MapPin className="w-4 h-4 text-blue-500" />
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{addr.title}:</span>
                                            <span className="text-gray-600 dark:text-gray-400 truncate">{addr.fullAddress}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Add Customer Modal */}
            {showAddCustomerModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-md relative">
                         <button onClick={() => setShowAddCustomerModal(false)} className="absolute top-4 left-4 text-gray-500 hover:text-red-500">
                            <Icons.Close className="w-6 h-6" />
                        </button>
                        <h3 className="text-lg font-bold mb-4">ثبت مشتری جدید</h3>
                        <form onSubmit={handleAddCustomer} className="space-y-4">
                            <Input label="نام مشتری / شرکت" value={newCustomer.fullName} onChange={e => setNewCustomer({...newCustomer, fullName: e.target.value})} required />
                            <Input label="شماره تماس" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} required />
                            <Button type="submit" className="w-full">ثبت مشتری</Button>
                        </form>
                    </GlassCard>
                </div>
            )}

            {/* Add Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-2xl relative flex flex-col h-[90vh] md:h-auto">
                        <button onClick={() => setShowAddressModal(null)} className="absolute top-4 left-4 text-gray-500 hover:text-red-500 z-10">
                            <Icons.Close className="w-6 h-6" />
                        </button>
                        <h3 className="text-lg font-bold mb-4">افزودن آدرس جدید</h3>
                        <div className="flex-grow overflow-y-auto">
                            <form onSubmit={handleAddAddress} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="عنوان آدرس (مثلا: منزل)" value={newAddress.title} onChange={e => setNewAddress({...newAddress, title: e.target.value})} required />
                                    <Input label="آدرس دقیق متنی" value={newAddress.fullAddress} onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})} required />
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">انتخاب موقعیت روی نقشه</label>
                                    <p className="text-xs text-blue-500 mb-2">برای پیدا کردن مکان خود، روی دکمه لوکیشن روی نقشه کلیک کنید.</p>
                                    <MapComponent 
                                        center={newAddress.location} 
                                        zoom={13} 
                                        className="h-64 md:h-80 border border-gray-300 rounded-xl"
                                        markers={[{ lat: newAddress.location.lat, lng: newAddress.location.lng, title: 'موقعیت انتخابی', type: 'pickup' }]}
                                        onMapClick={onMapClick}
                                    />
                                    <p className="text-xs text-gray-500 mt-1 text-center">مختصات انتخابی: {newAddress.location.lat.toFixed(4)}, {newAddress.location.lng.toFixed(4)}</p>
                                </div>

                                <Button type="submit" className="w-full mt-4">ذخیره آدرس</Button>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            )}
        </GlassCard>
    );
};

export default ManageCustomers;