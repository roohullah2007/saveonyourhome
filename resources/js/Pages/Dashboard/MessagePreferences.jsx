import { Head, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { Mail, Phone, MessageSquare, Shield } from 'lucide-react';

export default function MessagePreferences({ preferences }) {
    const { data, setData, post, processing } = useForm({
        delivery_method: preferences?.delivery_method || 'email',
        show_phone_publicly: preferences?.show_phone_publicly || false,
        show_email_publicly: preferences?.show_email_publicly || false,
        preferred_contact_hours: preferences?.preferred_contact_hours || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('dashboard.message-preferences.update'));
    };

    const deliveryOptions = [
        { value: 'email', label: 'Email only', desc: 'Messages forwarded to your email address', icon: Mail },
        { value: 'both', label: 'Email and SMS', desc: 'Receive both email and text notifications', icon: Phone },
        { value: 'platform', label: 'In-platform only', desc: 'Read messages only when logged in to your dashboard', icon: MessageSquare },
    ];

    return (
        <UserDashboardLayout title="Message Preferences">
            <Head title="Message Preferences" />

            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gray-100 p-2.5 rounded-xl">
                        <Shield className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'rgb(26, 24, 22)' }}>Message Preferences</h1>
                        <p style={{ fontSize: '14px', color: 'rgb(107, 114, 128)' }}>Control how buyers can reach you</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Delivery Method */}
                    <div className="rounded-2xl border border-gray-200 bg-white" style={{ padding: '32px', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'rgb(26, 24, 22)', marginBottom: '16px' }}>
                            How do you want to receive buyer messages?
                        </h2>
                        <div className="space-y-3">
                            {deliveryOptions.map(option => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                                        data.delivery_method === option.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="delivery_method"
                                        value={option.value}
                                        checked={data.delivery_method === option.value}
                                        onChange={(e) => setData('delivery_method', e.target.value)}
                                        className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                                    />
                                    <option.icon className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(26, 24, 22)' }}>{option.label}</p>
                                        <p style={{ fontSize: '13px', color: 'rgb(107, 114, 128)' }}>{option.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="rounded-2xl border border-gray-200 bg-white" style={{ padding: '32px', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'rgb(26, 24, 22)', marginBottom: '16px' }}>
                            Public visibility
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between">
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(26, 24, 22)' }}>Show phone number on listings</p>
                                    <p style={{ fontSize: '13px', color: 'rgb(107, 114, 128)' }}>Buyers can call or text you directly</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('show_phone_publicly', !data.show_phone_publicly)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.show_phone_publicly ? 'bg-gray-900' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${data.show_phone_publicly ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </label>
                            <label className="flex items-center justify-between">
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(26, 24, 22)' }}>Show email on listings</p>
                                    <p style={{ fontSize: '13px', color: 'rgb(107, 114, 128)' }}>Buyers can email you directly</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('show_email_publicly', !data.show_email_publicly)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.show_email_publicly ? 'bg-gray-900' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${data.show_email_publicly ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </label>
                        </div>
                    </div>

                    {/* Contact Hours */}
                    <div className="rounded-2xl border border-gray-200 bg-white" style={{ padding: '32px', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107, 114, 128)', marginBottom: '6px' }}>
                            Preferred contact hours
                        </label>
                        <input
                            type="text"
                            value={data.preferred_contact_hours}
                            onChange={(e) => setData('preferred_contact_hours', e.target.value)}
                            placeholder="e.g., Weekdays 6-9pm, Weekends anytime"
                            className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500"
                            style={{ height: '48px', fontSize: '15px', color: 'rgb(26, 24, 22)' }}
                        />
                        <p style={{ fontSize: '13px', color: 'rgb(156, 163, 175)', marginTop: '6px' }}>
                            Shown to buyers on the contact form
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: '#3355FF', height: '48px', paddingLeft: '32px', paddingRight: '32px', fontSize: '15px', fontWeight: 600 }}
                    >
                        {processing ? 'Saving...' : 'Save Preferences'}
                    </button>
                </form>
            </div>
        </UserDashboardLayout>
    );
}

MessagePreferences.layout = (page) => page;
