import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function AlreadyClaimed({ property }) {
    return (
        <>
            <Head title="Already Claimed - SaveOnYourHome" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-white border-b">
                    <div className="max-w-5xl mx-auto px-4 py-4">
                        <Link href="/" className="text-2xl font-bold text-[#1A1816]">
                            SaveOnYourHome
                        </Link>
                    </div>
                </header>

                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-white rounded-xl shadow-sm border p-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Claimed</h1>
                            <p className="text-gray-600 mb-6">
                                The property at <strong>{property.address}</strong> in{' '}
                                {property.city}, {property.state} has already been claimed and is
                                listed on SaveOnYourHome.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href={route('login')}
                                    className="block w-full py-3 bg-[#1A1816] text-white rounded-lg font-semibold hover:bg-[#8a1a2c] transition-colors"
                                >
                                    Log In to Your Account
                                </Link>
                                <Link
                                    href="/"
                                    className="block w-full py-3 border rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Go to Homepage
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
