
import React, { useState } from 'react';
import { Wallet } from '../../types';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const MOCK_WALLET: Wallet = {
    balance: 15750000,
    cardNumber: '6037-9918-1234-5678',
    shabaNumber: 'IR120170000000123456789012'
};

const WalletView: React.FC = () => {
    const [wallet, setWallet] = useState<Wallet>(MOCK_WALLET);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6">
            <GlassCard className="bg-gradient-to-br from-gray-900 to-gray-800 border-none text-white relative overflow-hidden !p-6 shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                 <div className="relative z-10">
                     <div className="flex justify-between items-start">
                         <div>
                             <p className="text-gray-400 text-xs">موجودی فعلی</p>
                             <h2 className="text-3xl font-bold mt-1 tracking-tight">{wallet.balance.toLocaleString('fa-IR')} <span className="text-sm font-normal text-gray-400">تومان</span></h2>
                         </div>
                         <div className="w-12 h-8 bg-yellow-500/80 rounded flex items-center justify-center">
                             <div className="w-8 h-5 border border-black/20 rounded-sm"></div>
                         </div>
                     </div>
                     
                     <div className="mt-8">
                         <p className="text-xl font-mono tracking-widest text-shadow">{wallet.cardNumber}</p>
                     </div>
                     
                     <div className="mt-6 flex justify-between items-end">
                         <div>
                             <p className="text-[10px] text-gray-400">شماره شبا</p>
                             <p className="text-xs font-mono">{wallet.shabaNumber}</p>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] text-gray-400">نام دارنده</p>
                             <p className="text-sm font-bold">علی رضایی</p>
                         </div>
                     </div>
                 </div>
            </GlassCard>

            <div className="grid grid-cols-2 gap-4">
                <Button className="bg-green-600 hover:bg-green-700 py-4 shadow-lg shadow-green-600/20">درخواست تسویه</Button>
                <Button variant="secondary" className="py-4" onClick={() => setIsEditing(!isEditing)}>ویرایش اطلاعات</Button>
            </div>

            {isEditing && (
                <GlassCard>
                    <h4 className="font-bold mb-4">ویرایش اطلاعات بانکی</h4>
                    <div className="space-y-4">
                        <Input label="شماره کارت" defaultValue={wallet.cardNumber} dir="ltr" className="text-center" />
                        <Input label="شماره شبا" defaultValue={wallet.shabaNumber} dir="ltr" className="text-center" />
                        <Button className="w-full">ذخیره تغییرات</Button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};

export default WalletView;
