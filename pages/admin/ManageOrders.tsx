
import React, { useState } from 'react';
import { Order, OrderStatus, Courier } from '../../types';
import { MOCK_ORDERS, MOCK_COURIERS } from '../../constants';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import MapComponent from '../../components/common/MapComponent';

const getStatusClass = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.NEW: return 'bg-blue-100 text-blue-800';
        case OrderStatus.ASSIGNED: return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.IN_TRANSIT: return 'bg-purple-100 text-purple-800';
        case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
        case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const ManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [couriers] = useState<Courier[]>(MOCK_COURIERS);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const handleAssignCourier = (courierId: string) => {
        if (selectedOrder) {
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, assignedCourierId: courierId, status: OrderStatus.ASSIGNED } : o));
            setSelectedOrder(null);
        }
    };
    
    const getCourierName = (courierId?: string) => {
        return couriers.find(c => c.id === courierId)?.fullName || '---';
    }

    return (
        <GlassCard>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">مدیریت سفارشات</h2>
                <div className="flex space-x-2 space-x-reverse">
                    <button onClick={() => setViewMode('list')} className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>لیست</button>
                    <button onClick={() => setViewMode('map')} className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>نقشه</button>
                </div>
            </div>

            {viewMode === 'map' ? (
                <MapComponent 
                    center={{ lat: 35.7219, lng: 51.3347 }} 
                    zoom={11}
                    markers={orders.map(o => ({ lat: o.pickupLocation.lat, lng: o.pickupLocation.lng, title: o.customerName, type: 'pickup' }))}
                />
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="py-4 px-4 text-right text-sm font-bold text-gray-900 dark:text-white">شماره سفارش</th>
                                <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">مشتری</th>
                                <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">وضعیت</th>
                                <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">سفیر</th>
                                <th scope="col" className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-transparent">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                    <td className="whitespace-nowrap py-4 px-4 text-sm font-mono text-gray-900 dark:text-white" dir="ltr">{order.id}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{order.customerName}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{getCourierName(order.assignedCourierId)}</td>
                                    <td className="relative whitespace-nowrap py-4 px-4 text-right text-sm font-medium">
                                        {order.status === OrderStatus.NEW && (
                                            <Button onClick={() => setSelectedOrder(order)} className="!text-xs !py-1 !px-2">اختصاص به سفیر</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">اختصاص سفارش {selectedOrder.id}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">یک سفیر فعال را انتخاب کنید:</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {couriers.filter(c => c.isOnline).length === 0 && <p className="text-center text-red-500 text-sm">سفیر آنلاینی یافت نشد</p>}
                            {couriers.filter(c => c.isOnline).map(courier => (
                                <button key={courier.id} onClick={() => handleAssignCourier(courier.id)} className="w-full text-right p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-700 transition-colors flex justify-between items-center group">
                                    <span>{courier.fullName}</span>
                                    <span className="text-xs text-gray-400 group-hover:text-blue-500">انتخاب</span>
                                </button>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={() => setSelectedOrder(null)} className="mt-4 w-full">لغو</Button>
                    </GlassCard>
                </div>
            )}
        </GlassCard>
    );
};

export default ManageOrders;
