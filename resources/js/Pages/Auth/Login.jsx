import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-white flex flex-col">
                {/* Logo Header */}
                <div className="flex justify-center items-center px-8 py-8">
                    <Link href="/">
                        <img
                            src="/images/saveonyourhome-logo.png"
                            alt="SaveOnYourHome"
                            className="h-10"
                        />
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-start justify-center px-4 py-8">
                    <div className="w-full max-w-[400px]">
                        <h1
                            className="text-[28px] font-bold text-[#111111] mb-2 text-center"
                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                        >
                            Sign in to SaveOnYourHome
                        </h1>
                        <p className="text-gray-500 text-center mb-8" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            Welcome back! Sign in to continue
                        </p>

                        {/* Google Sign In Button */}
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

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold text-[#111111] mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 transition-all"
                                    placeholder="you@example.com"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-bold text-[#111111]"
                                    >
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs text-[#0891B2] hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 transition-all pr-12"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
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
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-[#0891B2] border-gray-300 rounded focus:ring-[#0891B2]"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-[#111111] text-white rounded-full text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-[#0891B2] font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// Opt out of the default MainLayout
Login.layout = (page) => page;

export default Login;
