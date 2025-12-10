
import React, { useState } from 'react';
import { User, Role } from '../types';
import GlassCard from '../components/common/GlassCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { MOCK_COURIERS } from '../constants';

interface LoginScreenProps {
    onLogin: (user: User) => void;
}

const ROOT_ADMIN_USER: User = { id: 'root', username: 'armin7270', fullName: 'آرمین (مدیر کل)', role: Role.ROOT_ADMIN };
const MOCK_ADMIN_USER: User = { id: 'admin1', username: 'admin', fullName: 'مدیر سیستم', role: Role.ADMIN };

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerData, setRegisterData] = useState({
        fullName: '',
        nationalId: '',
        phone: '',
        address: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [show2FA, setShow2FA] = useState(false);
    const [otp, setOtp] = useState('');
    const [pendingUser, setPendingUser] = useState<User | null>(null);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Updated Root Admin Credentials
        if (username === ROOT_ADMIN_USER.username && password === 'ARmin@#8840028*') {
            setPendingUser(ROOT_ADMIN_USER);
            setShow2FA(true);
            return;
        }

        if (username === MOCK_ADMIN_USER.username && password === 'adminpass') {
             setPendingUser(MOCK_ADMIN_USER);
             setShow2FA(true);
             return;
        }

        const courier = MOCK_COURIERS.find(c => c.username === username);
        
        if (courier) {
             if (courier.status === 'تایید شده' && password === '1234') {
                setPendingUser(courier);
                setShow2FA(true);
                return;
             } else if (courier.status !== 'تایید شده') {
                 setError('حساب کاربری شما هنوز تایید نشده است.');
                 return;
             }
        }

        setError('نام کاربری یا رمز عبور اشتباه است.');
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation of registration
        setSuccessMsg('ثبت‌نام با موفقیت انجام شد. منتظر تایید مدیر باشید.');
        setTimeout(() => {
            setIsRegistering(false);
            setSuccessMsg('');
        }, 3000);
    };

    const handle2FASubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp === '123456' && pendingUser) {
            onLogin(pendingUser);
        } else {
            setError('کد تایید اشتباه است.');
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1617725916053-84b2383c2718?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
            
            <GlassCard className="w-full max-w-[420px] relative z-10 !p-8 !rounded-3xl border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6 transform rotate-3 hover:rotate-6 transition-all duration-500 group cursor-pointer">
                        <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">سامانه پیک پرو</h2>
                    <p className="text-gray-300 mt-3 text-sm font-medium">پلتفرم هوشمند مدیریت حمل و نقل</p>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-2xl mb-6 text-sm text-center font-bold animate-pulse backdrop-blur-sm">{error}</div>}
                {successMsg && <div className="bg-green-500/20 border border-green-500/30 text-green-200 p-4 rounded-2xl mb-6 text-sm text-center font-bold backdrop-blur-sm">{successMsg}</div>}

                {!show2FA ? (
                    <>
                        <div className="flex bg-gray-900/40 p-1.5 mb-8 rounded-2xl backdrop-blur-sm">
                            <button onClick={() => setIsRegistering(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${!isRegistering ? 'bg-white shadow-lg text-gray-900 scale-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>ورود</button>
                            <button onClick={() => setIsRegistering(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isRegistering ? 'bg-white shadow-lg text-gray-900 scale-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>ثبت‌نام</button>
                        </div>

                        {isRegistering ? (
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <Input id="reg-name" label="نام و نام خانوادگی" placeholder="نام کامل خود را وارد کنید" value={registerData.fullName} onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})} required />
                                <Input id="reg-melli" label="کد ملی" placeholder="کد ملی ۱۰ رقمی" value={registerData.nationalId} onChange={(e) => setRegisterData({...registerData, nationalId: e.target.value})} required />
                                <Input id="reg-phone" label="شماره موبایل" placeholder="۰۹xxxxxxxxx" value={registerData.phone} onChange={(e) => setRegisterData({...registerData, phone: e.target.value})} required />
                                <Input id="reg-address" label="آدرس سکونت" placeholder="آدرس دقیق محل سکونت" value={registerData.address} onChange={(e) => setRegisterData({...registerData, address: e.target.value})} required />
                                <Input id="reg-pass" label="رمز عبور" type="password" placeholder="یک رمز عبور امن انتخاب کنید" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required />
                                
                                <div className="h-24 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center text-gray-400 text-xs cursor-pointer hover:bg-white/10 hover:border-blue-400 transition-all group">
                                    <span className="group-hover:text-blue-300 transition-colors">انتخاب موقعیت مکانی روی نقشه</span>
                                </div>
                                <Button type="submit" className="w-full !py-4 !text-lg !rounded-2xl shadow-xl shadow-blue-600/30 mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400">ثبت نام در سامانه</Button>
                            </form>
                        ) : (
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <Input id="username" label="نام کاربری" dir="ltr" className="text-left" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                                <Input id="password" label="رمز عبور" type="password" dir="ltr" className="text-left" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center cursor-pointer">
                                        <input id="remember-me" type="checkbox" className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800" />
                                        <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-300 select-none cursor-pointer">مرا به خاطر بسپار</label>
                                    </div>
                                    <a href="#" className="text-xs text-blue-300 hover:text-white transition-colors">فراموشی رمز؟</a>
                                </div>
                                <Button type="submit" className="w-full !py-4 !text-lg !rounded-2xl shadow-xl shadow-blue-600/30 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400">ورود به حساب کاربری</Button>
                            </form>
                        )}
                    </>
                ) : (
                    <form onSubmit={handle2FASubmit} className="space-y-8 text-center">
                        <div className="mb-4">
                            <h3 className="text-white text-xl font-bold mb-2">تایید هویت دو مرحله‌ای</h3>
                            <p className="text-gray-400 text-sm">کد تایید پیامک شده را وارد کنید</p>
                        </div>
                        <Input id="2fa" label="" type="text" dir="ltr" className="text-center tracking-[1em] text-3xl font-mono py-4" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="______" required maxLength={6} autoFocus />
                        <div className="flex flex-col space-y-3">
                            <Button type="submit" className="w-full !py-4 !rounded-2xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-xl shadow-green-600/20">تایید و ورود</Button>
                            <button type="button" className="text-sm text-gray-400 hover:text-white transition-colors py-2" onClick={() => {setShow2FA(false); setOtp('');}}>بازگشت به صفحه قبل</button>
                        </div>
                    </form>
                )}
            </GlassCard>
            
            <div className="absolute bottom-6 text-white/30 text-xs font-light">
                © ۲۰۲۴ تمامی حقوق برای سامانه پیک پرو محفوظ است
            </div>
        </div>
    );
};

export default LoginScreen;