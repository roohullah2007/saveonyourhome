import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    Home,
    MessageSquare,
    Heart,
    User,
    LogOut,
    Menu,
    X,
    Calendar,
    Clock,
    ArrowLeft,
    Search,
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
        { name: 'Showings', href: route('dashboard.showings'), icon: Calendar, current: route().current('dashboard.showings*') },
        { name: 'Availability', href: route('dashboard.availability'), icon: Clock, current: route().current('dashboard.availability*') },
        { name: 'Favorites', href: route('dashboard.favorites'), icon: Heart, current: route().current('dashboard.favorites*') },
        { name: 'Saved Searches', href: route('dashboard.saved-searches'), icon: Search, current: route().current('dashboard.saved-searches*') },
        { name: 'Profile', href: route('profile.edit'), icon: User, current: route().current('profile.edit') },
    ];

    return (
        <div className="min-h-screen bg-[#F7F8FA]">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="flex items-center justify-between h-20 px-5 border-b border-gray-100">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/images/saveonyourhome-logo.png" alt="SaveOnYourHome" className="h-14 w-auto" />
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            {user.profile_photo ? (
                                <img
                                    src={`/storage/${user.profile_photo}`}
                                    alt={user.name}
                                    className="w-11 h-11 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-11 h-11 bg-[#1A1816] rounded-full flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[#111111] truncate text-sm">{user.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                                    item.current
                                        ? 'bg-[#1A1816] text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium text-sm flex-1">{item.name}</span>
                                {item.badge > 0 && (
                                    <span
                                        className="flex items-center justify-center rounded-full text-white text-[10px] font-bold"
                                        style={{ backgroundColor: 'rgb(239,68,68)', minWidth: '20px', height: '20px', padding: '0 6px' }}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-3 border-t border-gray-100 space-y-1">
                        <Link
                            href="/"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">Back to site</span>
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium text-sm">Log Out</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="lg:pl-72">
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <Menu className="w-5 h-5" />
                        <span className="font-medium text-sm">Menu</span>
                    </button>
                    <img src="/images/saveonyourhome-logo.png" alt="SaveOnYourHome" className="h-10 w-auto" />
                </div>

                <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto lg:mx-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
