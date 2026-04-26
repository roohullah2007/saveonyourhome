import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowLeft } from 'lucide-react';

function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

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
                                <Mail className="w-6 h-6 text-[#3355FF]" />
                            </div>
                        </div>

                        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#111111] mb-1 text-center">
                            Forgot your password?
                        </h1>
                        <p className="text-gray-500 text-center mb-6 sm:mb-8" style={{ fontSize: '14px' }}>
                            Enter your email and we'll send you a link to reset it.
                        </p>

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-700 flex items-start gap-3">
                                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{status}</span>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500 bg-white"
                                    style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }}
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#3355FF', height: '48px', fontSize: '15px', fontWeight: 600 }}
                            >
                                {processing ? 'Sending...' : 'Email password reset link'}
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

ForgotPassword.layout = (page) => page;

export default ForgotPassword;
