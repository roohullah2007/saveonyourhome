import { Head, Link, useForm } from '@inertiajs/react';
import { Home, Search } from 'lucide-react';

function GoogleComplete({ googleUser }) {
    const { data, setData, post, processing, errors } = useForm({
        user_type: 'buyer',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('auth.google.complete.store'));
    };

    return (
        <>
            <Head title="Complete Your Account" />

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
                        {/* Google User Info */}
                        <div className="text-center mb-8">
                            {googleUser.avatar && (
                                <img
                                    src={googleUser.avatar}
                                    alt={googleUser.name}
                                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-100"
                                />
                            )}
                            <h1
                                className="text-[28px] font-bold text-[#111111] mb-1"
                                style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                            >
                                Welcome, {googleUser.name?.split(' ')[0]}!
                            </h1>
                            <p className="text-gray-500 text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                {googleUser.email}
                            </p>
                        </div>

                        <p className="text-center text-gray-600 mb-8" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            One last step - tell us how you'll be using SaveOnYourHome
                        </p>

                        <form onSubmit={submit} className="space-y-6">
                            {/* User Type Selection */}
                            <div>
                                <label className="block text-sm font-bold text-[#111111] mb-3">
                                    I am a
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('user_type', 'buyer')}
                                        className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-300 ${
                                            data.user_type === 'buyer'
                                                ? 'border-[#0891B2] bg-[#0891B2]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-full ${
                                            data.user_type === 'buyer'
                                                ? 'bg-[#0891B2] text-white'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <span className={`font-semibold ${
                                            data.user_type === 'buyer'
                                                ? 'text-[#0891B2]'
                                                : 'text-gray-700'
                                        }`}>
                                            Buyer
                                        </span>
                                        <span className="text-xs text-gray-500 text-center">
                                            Looking for property
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('user_type', 'seller')}
                                        className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-300 ${
                                            data.user_type === 'seller'
                                                ? 'border-[#0891B2] bg-[#0891B2]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-full ${
                                            data.user_type === 'seller'
                                                ? 'bg-[#0891B2] text-white'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            <Home className="w-5 h-5" />
                                        </div>
                                        <span className={`font-semibold ${
                                            data.user_type === 'seller'
                                                ? 'text-[#0891B2]'
                                                : 'text-gray-700'
                                        }`}>
                                            Seller
                                        </span>
                                        <span className="text-xs text-gray-500 text-center">
                                            Selling my property
                                        </span>
                                    </button>
                                </div>
                                {errors.user_type && (
                                    <p className="mt-2 text-sm text-red-600">{errors.user_type}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-[#111111] text-white rounded-full text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating Account...' : 'Complete Sign Up'}
                            </button>

                            {/* Terms */}
                            <p className="text-xs text-gray-500 text-center">
                                By continuing, you agree to our{' '}
                                <Link href="/terms-of-use" className="text-[#0891B2] hover:underline">
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy-policy" className="text-[#0891B2] hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

// Opt out of the default MainLayout
GoogleComplete.layout = (page) => page;

export default GoogleComplete;
