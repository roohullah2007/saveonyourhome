import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Home, Search } from 'lucide-react';
import { useState } from 'react';

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        sms_consent: false,
        password: '',
        password_confirmation: '',
        user_type: 'buyer',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength(data.password);

    return (
        <>
            <Head title="Create Account" />

            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Logo Header */}
                <div className="flex justify-center items-center px-4 py-6 sm:py-8">
                    <Link href="/">
                        <img
                            src="/images/saveonyourhome-logo.png"
                            alt="SaveOnYourHome"
                            className="h-[36px] sm:h-[42px] w-auto"
                        />
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-start justify-center px-4 py-4 pb-12">
                    <div className="w-full max-w-[420px] rounded-2xl border border-gray-200/60 p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#111111] mb-1 text-center">
                            Create your account
                        </h1>
                        <p className="text-gray-500 text-center mb-6 sm:mb-8" style={{ fontSize: '14px' }}>
                            Join SaveOnYourHome to start your journey
                        </p>

                        {/* Google Sign Up Button */}
                        <a
                            href={route('auth.google')}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 rounded-full text-sm font-medium text-[#111111] bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors mb-6"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                            </svg>
                            Continue with Google
                        </a>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* User Type Selection */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '8px' }}>
                                    I am a
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('user_type', 'buyer')}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${
                                            data.user_type === 'buyer'
                                                ? 'border-[#1A1816] bg-[#1A1816]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-full ${
                                            data.user_type === 'buyer'
                                                ? 'bg-[#1A1816] text-white'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <span className={`font-semibold text-sm ${
                                            data.user_type === 'buyer'
                                                ? 'text-[#1A1816]'
                                                : 'text-gray-700'
                                        }`}>
                                            Buyer
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('user_type', 'seller')}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${
                                            data.user_type === 'seller'
                                                ? 'border-[#1A1816] bg-[#1A1816]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-full ${
                                            data.user_type === 'seller'
                                                ? 'bg-[#1A1816] text-white'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            <Home className="w-4 h-4" />
                                        </div>
                                        <span className={`font-semibold text-sm ${
                                            data.user_type === 'seller'
                                                ? 'text-[#1A1816]'
                                                : 'text-gray-700'
                                        }`}>
                                            Seller
                                        </span>
                                    </button>
                                </div>
                                {errors.user_type && (
                                    <p className="mt-2 text-sm text-red-600">{errors.user_type}</p>
                                )}
                            </div>

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500 bg-white" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500 bg-white" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }}
                                    placeholder="you@example.com"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>
                                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500 bg-white" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }}
                                    placeholder="(918) 555-0123"
                                    autoComplete="tel"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <label className="flex items-start gap-2 mt-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.sms_consent}
                                        onChange={(e) => setData('sms_consent', e.target.checked)}
                                        className="mt-0.5 rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
                                    />
                                    <span className="text-xs text-gray-600">I'd prefer texting</span>
                                </label>
                                <p className="text-[11px] text-gray-400 mt-1 ml-6">Msg & data rates may apply. Reply STOP to opt out.</p>
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="w-full rounded-xl border border-gray-300 px-4 pr-12 outline-none transition-colors focus:border-gray-500 bg-white" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }}
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">Must be at least 8 characters</p>
                                {/* Password Strength Indicator */}
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        level <= passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Strength: <span className="font-medium">{passwordStrength.label}</span>
                                        </p>
                                    </div>
                                )}
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="password_confirmation" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full rounded-xl border border-gray-300 px-4 pr-12 outline-none transition-colors focus:border-gray-500 bg-white" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {data.password_confirmation && (
                                    <p className={`mt-1 text-xs ${
                                        data.password === data.password_confirmation
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        {data.password === data.password_confirmation
                                            ? 'Passwords match'
                                            : 'Passwords do not match'
                                        }
                                    </p>
                                )}
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                style={{ backgroundColor: 'rgb(26,24,22)', height: '48px', fontSize: '15px', fontWeight: 600 }}
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </button>

                            {/* Terms */}
                            <p className="text-xs text-gray-500 text-center">
                                By creating an account, you agree to our{' '}
                                <Link href="/terms-of-use" className="text-[#1A1816] hover:underline">
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy-policy" className="text-[#1A1816] hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-[#1A1816] font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// Opt out of the default MainLayout
Register.layout = (page) => page;

export default Register;
