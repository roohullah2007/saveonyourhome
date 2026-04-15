import { Head, Link, usePage } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    Home,
    MessageSquare,
    Heart,
    User,
    Plus,
    Eye,
    ChevronRight,
    Calendar,
    Mail,
    MapPin,
    Edit,
    ExternalLink,
    QrCode,
    Camera,
    TrendingUp,
    Clock,
} from 'lucide-react';

function Dashboard({ properties = [], stats = {}, recentInquiries = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const statCards = [
        { label: 'Active Listings', value: stats.active_listings || 0, icon: Home, subtext: `${stats.pending_listings || 0} pending approval`, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Views', value: stats.total_views || 0, icon: Eye, subtext: 'All time views', color: 'from-emerald-500 to-emerald-600' },
        { label: 'Messages', value: stats.total_inquiries || 0, icon: MessageSquare, subtext: `${stats.unread_inquiries || 0} unread`, color: 'from-violet-500 to-violet-600' },
        { label: 'QR Scans', value: stats.total_qr_scans || 0, icon: QrCode, subtext: 'From yard signs', color: 'from-amber-500 to-amber-600' },
        { label: 'Saved Properties', value: stats.saved_properties || 0, icon: Heart, subtext: 'Properties saved', color: 'from-rose-500 to-rose-600' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'rejected': return 'bg-rose-50 text-rose-700 border border-rose-200';
            case 'sold': return 'bg-blue-50 text-blue-700 border border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMins = Math.floor(diffTime / (1000 * 60));
                return `${diffMins} min ago`;
            }
            return `${diffHours}h ago`;
        } else if (diffDays === 1) return 'Yesterday';
        else if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            <Head title="Dashboard" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#111111]">
                    Welcome back, {user.name.split(' ')[0]}
                </h1>
                <p className="text-gray-500 mt-1.5 text-sm">
                    Here's what's happening with your properties.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            {stat.value > 0 && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="text-2xl font-bold text-[#111111] leading-tight">
                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </div>
                        <div className="text-xs font-medium text-gray-700 mt-0.5">{stat.label}</div>
                        <div className="text-[11px] text-gray-400 mt-1">{stat.subtext}</div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Listings */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-[#111111]">Your Listings</h2>
                        <Link
                            href={route('dashboard.listings')}
                            className="text-gray-600 hover:text-[#111111] font-medium text-sm flex items-center gap-1 transition-colors"
                        >
                            View all
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {properties.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                <Home className="w-7 h-7 text-gray-400" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">No listings yet</h3>
                            <p className="text-sm text-gray-500 mb-5">Start by adding your first property listing</p>
                            <Link
                                href="/list-property"
                                className="inline-flex items-center gap-2 bg-[#1A1816] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Listing
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {properties.slice(0, 4).map((listing) => (
                                <div key={listing.id} className="p-4 hover:bg-gray-50/60 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={listing.photos?.[0] || '/images/property-placeholder.jpg'}
                                                alt={listing.property_title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/images/property-placeholder.jpg'; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-[#111111] truncate text-sm">
                                                        {listing.property_title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {listing.city}, {listing.state}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <Link
                                                        href={`/dashboard/listings/${listing.id}/edit`}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/properties/${listing.slug || listing.id}`}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                                        title="View"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="text-base font-bold text-[#1A1816]">
                                                    ${Number(listing.price).toLocaleString()}
                                                </span>
                                                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${getStatusColor(listing.approval_status)}`}>
                                                    {listing.approval_status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {listing.views || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDate(listing.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Messages */}
                <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-[#111111]">Recent Messages</h2>
                        <Link
                            href={route('dashboard.messages')}
                            className="text-gray-600 hover:text-[#111111] font-medium text-sm flex items-center gap-1 transition-colors"
                        >
                            View all
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentInquiries.length === 0 ? (
                        <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                                <MessageSquare className="w-7 h-7 text-gray-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">No messages yet</p>
                            <p className="text-xs text-gray-400 mt-1">Buyer inquiries will appear here</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
                            {recentInquiries.slice(0, 4).map((inquiry) => (
                                <Link
                                    key={inquiry.id}
                                    href={route('dashboard.messages')}
                                    className={`block p-4 hover:bg-gray-50/60 transition-colors ${
                                        inquiry.status === 'new' ? 'bg-blue-50/40' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className={`text-sm text-[#111111] truncate ${inquiry.status === 'new' ? 'font-semibold' : 'font-medium'}`}>
                                                    {inquiry.name}
                                                </h4>
                                                {inquiry.status === 'new' && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-blue-600 mt-0.5 truncate">
                                                Re: {inquiry.property?.property_title}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                {inquiry.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1.5">
                                                {formatDate(inquiry.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-200/80 p-5">
                <h2 className="text-base font-semibold text-[#111111] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { href: '/list-property', icon: Plus, label: 'Add Listing' },
                        { href: '/properties', icon: Home, label: 'Browse' },
                        { href: route('profile.edit'), icon: User, label: 'Profile' },
                        { href: '/contact', icon: Mail, label: 'Support' },
                    ].map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-200 hover:border-[#1A1816] hover:bg-[#1A1816]/5 transition-all group"
                        >
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#1A1816] transition-colors">
                                <action.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-xs font-medium text-gray-700 group-hover:text-[#111111] transition-colors">
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

export default Dashboard;
