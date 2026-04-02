import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/Components/Header';
import {
    LayoutDashboard,
    Home,
    MessageSquare,
    Heart,
    User,
    Settings,
    LogOut,
    Plus,
    Eye,
    TrendingUp,
    ChevronRight,
    Menu,
    X,
    Calendar,
    Mail,
    MapPin,
    MoreVertical,
    Edit,
    ExternalLink,
    QrCode,
    Camera,
} from 'lucide-react';

function Dashboard({ properties = [], stats = {}, recentInquiries = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Overview', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') && !route().current('dashboard.*') },
        { name: 'My Listings', href: route('dashboard.listings'), icon: Home, current: route().current('dashboard.listings') },
        { name: 'Messages', href: route('dashboard.messages'), icon: MessageSquare, current: route().current('dashboard.messages'), badge: stats.unread_inquiries || 0 },
        { name: 'Saved Properties', href: route('dashboard.favorites'), icon: Heart, current: route().current('dashboard.favorites') },
        { name: 'Profile', href: route('profile.edit'), icon: User, current: route().current('profile.edit') },
    ];

    const statCards = [
        { label: 'Active Listings', value: stats.active_listings || 0, icon: Home, subtext: `${stats.pending_listings || 0} pending approval` },
        { label: 'Total Views', value: stats.total_views || 0, icon: Eye, subtext: 'All time views' },
        { label: 'Messages', value: stats.total_inquiries || 0, icon: MessageSquare, subtext: `${stats.unread_inquiries || 0} unread` },
        { label: 'QR Scans', value: stats.total_qr_scans || 0, icon: QrCode, subtext: 'From yard signs' },
        { label: 'Saved Properties', value: stats.saved_properties || 0, icon: Heart, subtext: 'Properties saved' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'sold': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
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
            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        }
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-[#F8F7F5]">
            <Head title="Dashboard" />

            {/* Original Website Header */}
            <Header />

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Fixed, starts below header */}
            <aside
                className={`fixed top-[77px] bottom-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile close button */}
                    <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 lg:hidden">
                        <span className="font-semibold text-gray-900">Menu</span>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#1A1816] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3
                                    className="font-semibold text-[#111111] truncate"
                                   
                                >
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                    item.current
                                        ? 'bg-[#1A1816] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                               
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                                {item.badge > 0 && (
                                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                                        item.current
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-900 text-white'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                           
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Log Out</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content area - offset by sidebar width and header height */}
            <div className="lg:pl-72 pt-[77px]">
                {/* Mobile menu button bar */}
                <div className="lg:hidden sticky top-[77px] z-30 bg-white border-b border-gray-200 px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <Menu className="w-5 h-5" />
                        <span className="font-medium">Menu</span>
                    </button>
                </div>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1
                            className="text-2xl lg:text-3xl font-bold text-[#111111]"
                           
                        >
                            Welcome back, {user.name.split(' ')[0]}!
                        </h1>
                        <p className="text-gray-500 mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            Here's what's happening with your properties
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-gray-100 p-3 rounded-xl">
                                        <stat.icon className="w-6 h-6 text-gray-600" />
                                    </div>
                                    {stat.value > 0 && <TrendingUp className="w-5 h-5 text-green-500" />}
                                </div>
                                <h3
                                    className="text-3xl font-bold text-[#111111] mb-1"
                                   
                                >
                                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                </h3>
                                <p className="text-gray-500 text-sm mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                    {stat.label}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {stat.subtext}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                        {/* Recent Listings */}
                        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2
                                    className="text-xl font-bold text-[#111111]"
                                   
                                >
                                    Your Listings
                                </h2>
                                <Link
                                    href={route('dashboard.listings')}
                                    className="text-[#1A1816] font-medium text-sm hover:underline flex items-center gap-1"
                                    style={{ fontFamily: '"Poppins", sans-serif' }}
                                >
                                    View All
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {properties.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                                    <p className="text-gray-500 mb-6">Start by adding your first property listing</p>
                                    <Link
                                        href="/list-property"
                                        className="inline-flex items-center gap-2 bg-[#1A1816] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#111111] transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Your First Listing
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {properties.map((listing) => (
                                        <div key={listing.id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex gap-4 h-[120px]">
                                                <div className="w-28 sm:w-36 h-full bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={listing.photos?.[0] || '/images/property-placeholder.jpg'}
                                                        alt={listing.property_title}
                                                        className="w-full h-full object-cover object-center"
                                                        onError={(e) => {
                                                            e.target.src = '/images/property-placeholder.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h3
                                                                className="font-semibold text-[#111111] truncate"
                                                               
                                                            >
                                                                {listing.property_title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                {listing.city}, {listing.state}
                                                            </p>
                                                        </div>
                                                        <div className="relative group">
                                                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                                <MoreVertical className="w-5 h-5 text-gray-400" />
                                                            </button>
                                                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                                <Link
                                                                    href={route('dashboard.listings.edit', listing.id)}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                    Edit
                                                                </Link>
                                                                <Link
                                                                    href={`/properties/${listing.id}`}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    View
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                                        <span
                                                            className="text-lg font-bold text-[#1A1816]"
                                                           
                                                        >
                                                            ${Number(listing.price).toLocaleString()}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(listing.approval_status)}`}>
                                                            {listing.approval_status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {listing.views || 0} views
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
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
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2
                                    className="text-xl font-bold text-[#111111]"
                                   
                                >
                                    Recent Messages
                                </h2>
                                <Link
                                    href={route('dashboard.messages')}
                                    className="text-[#1A1816] font-medium text-sm hover:underline flex items-center gap-1"
                                    style={{ fontFamily: '"Poppins", sans-serif' }}
                                >
                                    View All
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {recentInquiries.length === 0 ? (
                                <div className="p-8 text-center">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-gray-500">No messages yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Messages from interested buyers will appear here</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {recentInquiries.map((inquiry) => (
                                        <Link
                                            key={inquiry.id}
                                            href={route('dashboard.messages')}
                                            className={`block p-4 hover:bg-gray-50 transition-colors ${
                                                inquiry.status === 'new' ? 'bg-blue-50/50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4
                                                            className={`font-medium text-[#111111] truncate ${
                                                                inquiry.status === 'new' ? 'font-semibold' : ''
                                                            }`}
                                                           
                                                        >
                                                            {inquiry.name}
                                                        </h4>
                                                        {inquiry.status === 'new' && (
                                                            <span className="w-2 h-2 bg-[#1A1816] rounded-full flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-[#1A1816] mt-0.5 truncate">
                                                        Re: {inquiry.property?.property_title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {inquiry.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {formatDate(inquiry.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {recentInquiries.length > 0 && (
                                <div className="p-4 border-t border-gray-100">
                                    <Link
                                        href={route('dashboard.messages')}
                                        className="w-full py-3 text-center text-[#1A1816] font-medium rounded-xl hover:bg-gray-50 transition-colors block"
                                       
                                    >
                                        View All Messages
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
                        <h2
                            className="text-xl font-bold text-[#111111] mb-4"
                           
                        >
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            <Link
                                href="/list-property"
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1A1816] hover:bg-[#1A1816]/5 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#1A1816] transition-colors">
                                    <Plus className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <span
                                    className="text-sm font-medium text-gray-600 group-hover:text-[#555] transition-colors text-center"
                                   
                                >
                                    Add Listing
                                </span>
                            </Link>
                            <Link
                                href="/our-packages"
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1A1816] hover:bg-[#1A1816]/5 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#1A1816] transition-colors">
                                    <Camera className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <span
                                    className="text-sm font-medium text-gray-600 group-hover:text-[#555] transition-colors text-center"
                                   
                                >
                                    Photos & Media
                                </span>
                            </Link>
                            <Link
                                href="/properties"
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1A1816] hover:bg-[#1A1816]/5 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#1A1816] transition-colors">
                                    <Home className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <span
                                    className="text-sm font-medium text-gray-600 group-hover:text-[#555] transition-colors text-center"
                                   
                                >
                                    Browse Properties
                                </span>
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1A1816] hover:bg-[#1A1816]/5 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#1A1816] transition-colors">
                                    <User className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <span
                                    className="text-sm font-medium text-gray-600 group-hover:text-[#555] transition-colors text-center"
                                   
                                >
                                    Edit Profile
                                </span>
                            </Link>
                            <Link
                                href="/contact"
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1A1816] hover:bg-[#1A1816]/5 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#1A1816] transition-colors">
                                    <Mail className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <span
                                    className="text-sm font-medium text-gray-600 group-hover:text-[#555] transition-colors text-center"
                                   
                                >
                                    Get Support
                                </span>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Opt out of the default MainLayout
Dashboard.layout = (page) => page;

export default Dashboard;
