import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 500,
        color: 'rgb(107,114,128)',
        marginBottom: '6px',
    };

    const inputStyle = { height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' };

    return (
        <>
            <Head title="Reset Password" />

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="flex justify-center items-center px-4 py-6 sm:py-8">
                    <Link href="/">
                        <img
                            src="/images/saveonyourhome-logo.png"
                            alt="SaveOnYourHome"
                            className="h-[36px] sm:h-[42px] w-auto"
                        />
                    </Link>
                </div>

                <div className="flex-1 flex items-start justify-center px-4 py-4 sm:py-8">
                    <div
                        className="w-full max-w-[420px] rounded-2xl border border-gray-200/60 p-6 sm:p-8"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(16px)',
                            boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset',
                        }}
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#3355FF]/10 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-[#3355FF]" />
                            </div>
                        </div>

                        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#111111] mb-1 text-center">
                            Reset your password
                        </h1>
                        <p className="text-gray-500 text-center mb-6 sm:mb-8" style={{ fontSize: '14px' }}>
                            Choose a new password to secure your account.
                        </p>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="email" style={labelStyle}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500 bg-white"
                                    style={inputStyle}
                                    placeholder="you@example.com"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" style={labelStyle}>
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="w-full rounded-xl border border-gray-300 px-4 pr-12 outline-none transition-colors focus:border-gray-500 bg-white"
                                        style={inputStyle}
                                        placeholder="At least 8 characters"
                                        autoComplete="new-password"
                                        autoFocus
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" style={labelStyle}>
                                    Confirm new password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirm ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full rounded-xl border border-gray-300 px-4 pr-12 outline-none transition-colors focus:border-gray-500 bg-white"
                                        style={inputStyle}
                                        placeholder="Re-enter your new password"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#3355FF', height: '48px', fontSize: '15px', fontWeight: 600 }}
                            >
                                {processing ? 'Resetting...' : 'Reset password'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1A1816]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ResetPassword.layout = (page) => page;

export default ResetPassword;
