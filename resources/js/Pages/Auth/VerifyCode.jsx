import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

function VerifyCode({ email }) {
    const [resending, setResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const inputRefs = useRef([]);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Handle individual digit input
    const handleDigitChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newCode = data.code.split('');
        newCode[index] = value;
        const updatedCode = newCode.join('').slice(0, 6);
        setData('code', updatedCode.padEnd(6, ''));

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !data.code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        setData('code', pastedData.padEnd(6, ''));

        // Focus the appropriate input
        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const submit = (e) => {
        e.preventDefault();
        const cleanCode = data.code.replace(/\s/g, '');
        if (cleanCode.length !== 6) return;

        post(route('verification.code.verify'));
    };

    const resendCode = () => {
        setResending(true);
        setResendSuccess(false);

        router.post(route('verification.code.resend'), {}, {
            onSuccess: () => {
                setResendSuccess(true);
                setResending(false);
                setTimeout(() => setResendSuccess(false), 5000);
            },
            onError: () => {
                setResending(false);
            }
        });
    };

    return (
        <>
            <Head title="Verify Your Email" />

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
                <div className="flex-1 flex items-start justify-center px-4 py-8 pb-12">
                    <div className="w-full max-w-[420px]">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-[#1A1816]/10 rounded-full flex items-center justify-center">
                                <Mail className="w-10 h-10 text-[#1A1816]" />
                            </div>
                        </div>

                        <h1
                            className="text-[28px] font-bold text-[#111111] mb-2 text-center"
                           
                        >
                            Verify your email
                        </h1>
                        <p className="text-gray-500 text-center mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            We sent a 6-digit code to
                        </p>
                        <p className="text-[#111111] font-semibold text-center mb-8">
                            {email}
                        </p>

                        {/* Success Message */}
                        {resendSuccess && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-700">
                                    A new verification code has been sent to your email.
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {errors.code && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-700">{errors.code}</p>
                            </div>
                        )}

                        <form onSubmit={submit}>
                            {/* 6-Digit Code Input */}
                            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={data.code[index] || ''}
                                        onChange={(e) => handleDigitChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1A1816] focus:ring-2 focus:ring-[#1A1816]/20 transition-all"
                                        autoComplete="off"
                                    />
                                ))}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || data.code.replace(/\s/g, '').length !== 6}
                                className="w-full py-3 px-4 bg-[#1A1816] text-white rounded-full text-sm font-semibold hover:bg-[#111111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>

                        {/* Resend Code */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 mb-2">
                                Didn't receive the code?
                            </p>
                            <button
                                type="button"
                                onClick={resendCode}
                                disabled={resending}
                                className="inline-flex items-center gap-2 text-[#1A1816] font-medium text-sm hover:underline disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                                {resending ? 'Sending...' : 'Resend Code'}
                            </button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 text-center">
                                The code expires in 15 minutes. Check your spam folder if you don't see the email.
                                <br />
                                <span className="text-gray-400">Code sent from noreply@updates.saveonyourhome.com</span>
                            </p>
                        </div>

                        {/* Back to Login */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Wrong email?{' '}
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-[#1A1816] font-medium hover:underline"
                            >
                                Sign out and try again
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// Opt out of the default MainLayout
VerifyCode.layout = (page) => page;

export default VerifyCode;
