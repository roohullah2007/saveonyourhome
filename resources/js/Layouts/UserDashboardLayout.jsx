import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/Components/Header';
import {
    LayoutDashboard,
    Home,
    MessageSquare,
    Heart,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';

export default function UserDashboardLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const unreadMessages = auth.unreadMessages || 0;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Overview', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') && !route().current('dashboard.*') },
        { name: 'My Listings', href: route('dashboard.listings'), icon: Home, current: route().current('dashboard.listings*') },
        { name: 'Messages', href: route('dashboard.messages'), icon: MessageSquare, current: route().current('dashboard.messages*'), badge: unreadMessages },
        { name: 'Saved Properties', href: route('dashboard.favorites'), icon: Heart, current: route().current('dashboard.favorites*') },
        { name: 'Profile', href: route('profile.edit'), icon: User, current: route().current('profile.edit') },
    ];

    return (
        <div className="min-h-screen bg-[#F8F7F5]">
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
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-[#1A1816] font-semibold text-lg">
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
                                <span className="font-medium flex-1">{item.name}</span>
                                {item.badge > 0 && (
                                    <span className="flex items-center justify-center rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: 'rgb(239,68,68)', minWidth: '20px', height: '20px', padding: '0 6px' }}>
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
                    {children}
                </main>
            </div>
        </div>
    );
}
