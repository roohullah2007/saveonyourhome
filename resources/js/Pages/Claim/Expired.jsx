import { Head, Link } from '@inertiajs/react';
import { Clock, Home } from 'lucide-react';

export default function ClaimExpired({ property }) {
    return (
        <>
            <Head title="Claim Expired - SaveOnYourHome" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-white border-b">
                    <div className="max-w-5xl mx-auto px-4 py-4">
                        <Link href="/" className="text-2xl font-bold text-[#0891B2]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            SaveOnYourHome
                        </Link>
                    </div>
                </header>

                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-white rounded-xl shadow-sm border p-8">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-orange-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Link Expired</h1>
                            <p className="text-gray-600 mb-6">
                                The claim link for <strong>{property.address}</strong> in{' '}
                                {property.city}, {property.state} has expired.
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Don't worry! You can still list your property for free by creating
                                an account on SaveOnYourHome.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href={route('register')}
                                    className="block w-full py-3 bg-[#0891B2] text-white rounded-lg font-semibold hover:bg-[#8a1a2c] transition-colors"
                                >
                                    List My Property Free
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
