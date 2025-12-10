
import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { MOCK_ORDERS } from '../../constants';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import MapComponent from '../../components/common/MapComponent';
import { Icons } from '../../constants';

interface OrderListProps {
    courierId: string;
}

const getStatusClass = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.NEW: return 'bg-blue-100 text-blue-700 border border-blue-200';
        case OrderStatus.ASSIGNED: return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
        case OrderStatus.IN_TRANSIT: return 'bg-purple-100 text-purple-700 border border-purple-200';
        case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700 border border-green-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const OrderList: React.FC<OrderListProps> = ({ courierId }) => {
    const [orders, setOrders] = useState<Order[]>(
        MOCK_ORDERS.filter(o => o.assignedCourierId === courierId || o.status === OrderStatus.NEW)
    );
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const handleAcceptOrder = (orderId: string) => {
        setOrders(prevOrders => prevOrders.map(o => 
            o.id === orderId ? { ...o, status: OrderStatus.ASSIGNED, assignedCourierId: courierId } : o
        ));
    };
    
    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setOrders(prevOrders => prevOrders.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
    };

    const openNavigation = (lat: number, lng: number, app: 'google' | 'neshan' | 'balad') => {
        let url = '';
        if (app === 'google') url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        if (app === 'neshan') url = `https://nshn.ir/?lat=${lat}&lng=${lng}`;
        if (app === 'balad') url = `balad://route?dest_lat=${lat}&dest_lng=${lng}&mode=driving`;
        
        window.open(url, '_blank');
    };

    const courierOrders = orders.filter(o => o.assignedCourierId === courierId);
    const newOrders = orders.filter(o => o.status === OrderStatus.NEW);

    const renderOrderCard = (order: Order) => (
         <GlassCard key={order.id} className="mb-4 !p-5 relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                     <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                    </span>
                    <span className="mr-3 text-xs text-gray-400 font-mono" dir="ltr">#{order.id}</span>
                </div>
                <div className="text-lg font-bold text-green-600">{order.price.toLocaleString('fa-IR')} تومان</div>
            </div>
            
            <div className="space-y-4 relative z-10">
                {/* Pickup Section */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start">
                         <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 ml-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                         <div>
                             <p className="text-xs text-gray-500">مبدا</p>
                             <p className="text-gray-800 dark:text-gray-200 font-medium text-sm leading-relaxed">{order.pickupAddress}</p>
                         </div>
                    </div>
                    {order.status !== OrderStatus.NEW && (
                        <div className="flex gap-1">
                            <button onClick={() => openNavigation(order.pickupLocation.lat, order.pickupLocation.lng, 'google')} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600" title="گوگل مپ"><span className="text-xs font-bold">G</span></button>
                            <button onClick={() => openNavigation(order.pickupLocation.lat, order.pickupLocation.lng, 'neshan')} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600" title="نشان"><span className="text-xs font-bold">N</span></button>
                            <button onClick={() => openNavigation(order.pickupLocation.lat, order.pickupLocation.lng, 'balad')} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600" title="بلد"><span className="text-xs font-bold">B</span></button>
                        </div>
                    )}
                </div>

                {/* Delivery Section */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 ml-3 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        <div>
                            <p className="text-xs text-gray-500">مقصد</p>
                            <p className="text-gray-800 dark:text-gray-200 font-medium text-sm leading-relaxed">{order.deliveryAddress}</p>
                        </div>
                    </div>
                     {order.status !== OrderStatus.NEW && (
                        <div className="flex gap-1">
                            <button onClick={() => openNavigation(order.deliveryLocation.lat, order.deliveryLocation.lng, 'google')} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600" title="گوگل مپ"><span className="text-xs font-bold">G</span></button>
                            <button onClick={() => openNavigation(order.deliveryLocation.lat, order.deliveryLocation.lng, 'neshan')} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600" title="نشان"><span className="text-xs font-bold">N</span></button>
                            <button onClick={() => openNavigation(order.deliveryLocation.lat, order.deliveryLocation.lng, 'balad')} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600" title="بلد"><span className="text-xs font-bold">B</span></button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                {order.status === OrderStatus.NEW && <Button onClick={() => handleAcceptOrder(order.id)} className="flex-1 w-full">قبول درخواست</Button>}
                {order.status === OrderStatus.ASSIGNED && <Button onClick={() => handleStatusChange(order.id, OrderStatus.IN_TRANSIT)} className="flex-1 bg-purple-600 hover:bg-purple-700">شروع حرکت</Button>}
                {order.status === OrderStatus.IN_TRANSIT && <Button onClick={() => handleStatusChange(order.id, OrderStatus.DELIVERED)} className="flex-1 bg-green-600 hover:bg-green-700">تحویل شد</Button>}
                
                {order.status !== OrderStatus.NEW && (
                     <a href="tel:09123456789" className="flex items-center justify-center px-4 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors">
                        <Icons.Phone className="w-5 h-5" />
                        <span className="mr-2 text-sm font-bold">تماس با مشتری</span>
                     </a>
                )}

                <Button variant="secondary" className="px-3" onClick={() => setViewMode('map')}>
                     <Icons.MapPin className="h-5 w-5" />
                </Button>
            </div>
        </GlassCard>
    );

    return (
        <div>
            {viewMode === 'map' && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">نقشه سفارشات</h3>
                        <button onClick={() => setViewMode('list')} className="text-sm text-blue-500">بازگشت به لیست</button>
                    </div>
                    <MapComponent 
                        center={{ lat: 35.7219, lng: 51.3347 }} 
                        zoom={12}
                        markers={[
                            ...orders.map(o => ({ lat: o.pickupLocation.lat, lng: o.pickupLocation.lng, title: 'مبدا: ' + o.customerName, type: 'pickup' as const })),
                            ...orders.map(o => ({ lat: o.deliveryLocation.lat, lng: o.deliveryLocation.lng, title: 'مقصد: ' + o.customerName, type: 'delivery' as const }))
                        ]}
                    />
                </div>
            )}

            {viewMode === 'list' && (
                <>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        <span className="w-1 h-6 bg-blue-600 rounded-full ml-2"></span>
                        سفارشات فعال من
                    </h3>
                    {courierOrders.length > 0 ? courierOrders.map(renderOrderCard) : <GlassCard className="py-8"><p className="text-center text-gray-500">سفارش فعالی ندارید.</p></GlassCard>}
                    
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4 flex items-center">
                         <span className="w-1 h-6 bg-green-500 rounded-full ml-2"></span>
                        سفارشات جدید در منطقه
                    </h3>
                    {newOrders.length > 0 ? newOrders.map(renderOrderCard) : <GlassCard className="py-8"><p className="text-center text-gray-500">سفارش جدیدی موجود نیست.</p></GlassCard>}
                </>
            )}
        </div>
    );
};

export default OrderList;