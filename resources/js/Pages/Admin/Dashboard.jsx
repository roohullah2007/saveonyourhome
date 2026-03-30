import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Home,
    Users,
    Eye,
    MessageSquare,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    Star,
    ArrowRight,
    Mail,
    Upload
} from 'lucide-react';

export default function Dashboard({
    stats,
    recentProperties,
    recentUsers,
    recentInquiries,
    recentActivity,
    monthlyStats,
    importStats
}) {
    const statCards = [
        {
            label: 'Total Properties',
            value: stats.total_properties,
            icon: Home,
            color: 'bg-blue-500',
            href: route('admin.properties.index'),
        },
        {
            label: 'Active Listings',
            value: stats.active_properties,
            icon: CheckCircle,
            color: 'bg-green-500',
            href: route('admin.properties.index', { approval: 'approved' }),
        },
        {
            label: 'Pending Approval',
            value: stats.pending_properties,
            icon: Clock,
            color: 'bg-yellow-500',
            href: route('admin.properties.index', { approval: 'pending' }),
        },
        {
            label: 'Featured',
            value: stats.featured_properties,
            icon: Star,
            color: 'bg-purple-500',
            href: route('admin.properties.index', { featured: 'yes' }),
        },
        {
            label: 'Total Users',
            value: stats.total_users,
            icon: Users,
            color: 'bg-indigo-500',
            href: route('admin.users.index'),
        },
        {
            label: 'Sellers',
            value: stats.sellers,
            icon: Users,
            color: 'bg-teal-500',
            href: route('admin.users.index', { role: 'seller' }),
        },
        {
            label: 'New Inquiries',
            value: stats.new_inquiries,
            icon: MessageSquare,
            color: 'bg-orange-500',
            href: route('admin.inquiries.index', { status: 'new' }),
        },
        {
            label: 'Total Views',
            value: stats.total_views?.toLocaleString() || '0',
            icon: Eye,
            color: 'bg-pink-500',
            href: '#',
        },
        ...(importStats && importStats.total_imported > 0 ? [{
            label: 'FSBO Imports',
            value: `${importStats.total_claimed}/${importStats.total_imported}`,
            icon: Upload,
            color: 'bg-rose-500',
            href: route('admin.imports.index'),
        }] : []),
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
            new: 'bg-blue-100 text-blue-700',
            read: 'bg-gray-100 text-gray-700',
            responded: 'bg-green-100 text-green-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.href}
                        className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Properties */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            Recent Properties
                        </h2>
                        <Link
                            href={route('admin.properties.index')}
                            className="text-sm text-[#0891B2] hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentProperties.length === 0 ? (
                            <div className="p-5 text-center text-gray-500">
                                No properties yet
                            </div>
                        ) : (
                            recentProperties.map((property) => (
                                <div key={property.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {property.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {property.owner} • {property.created_at}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-[#0891B2]">
                                                {property.price}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(property.approval_status)}`}>
                                                {property.approval_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            Recent Users
                        </h2>
                        <Link
                            href={route('admin.users.index')}
                            className="text-sm text-[#0891B2] hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentUsers.length === 0 ? (
                            <div className="p-5 text-center text-gray-500">
                                No users yet
                            </div>
                        ) : (
                            recentUsers.map((user) => (
                                <div key={user.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-gray-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Inquiries */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            Recent Inquiries
                        </h2>
                        <Link
                            href={route('admin.inquiries.index')}
                            className="text-sm text-[#0891B2] hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentInquiries.length === 0 ? (
                            <div className="p-5 text-center text-gray-500">
                                No inquiries yet
                            </div>
                        ) : (
                            recentInquiries.map((inquiry) => (
                                <div key={inquiry.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {inquiry.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                Re: {inquiry.property} • {inquiry.created_at}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(inquiry.status)}`}>
                                            {inquiry.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            Recent Activity
                        </h2>
                        <Link
                            href={route('admin.activity.index')}
                            className="text-sm text-[#0891B2] hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {recentActivity.length === 0 ? (
                            <div className="p-5 text-center text-gray-500">
                                No activity yet
                            </div>
                        ) : (
                            recentActivity.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 bg-[#0891B2] rounded-full flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">{log.user}</span>{' '}
                                                {log.action.toLowerCase()}
                                                {log.model_type && (
                                                    <span className="text-gray-500"> ({log.model_type})</span>
                                                )}
                                            </p>
                                            {log.description && (
                                                <p className="text-sm text-gray-500 truncate">{log.description}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">{log.created_at}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Opt out of the default MainLayout
Dashboard.layout = (page) => page;
