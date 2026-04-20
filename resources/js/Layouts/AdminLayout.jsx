import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Home,
    Users,
    MessageSquare,
    Mail,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Bell,
    Shield,
    Tags,
    Layers,
    BookOpen,
    BarChart3,
    FileText,
    Handshake,
    Package,
    Activity,
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, current: route().current('admin.dashboard') },
        { name: 'Analytics', href: route('admin.analytics.index'), icon: BarChart3, current: route().current('admin.analytics.*') },
        { name: 'Properties', href: route('admin.properties.index'), icon: Home, current: route().current('admin.properties.*') },
        { name: 'Users', href: route('admin.users.index'), icon: Users, current: route().current('admin.users.*') },
        { name: 'Inquiries', href: route('admin.inquiries.index'), icon: MessageSquare, current: route().current('admin.inquiries.*') },
        { name: 'Messages', href: route('admin.messages.index'), icon: Mail, current: route().current('admin.messages.*') },
        { name: 'Taxonomies', href: route('admin.taxonomies.index'), icon: Tags, current: route().current('admin.taxonomies.*') },
        { name: 'Amenities', href: route('admin.amenities.index'), icon: Layers, current: route().current('admin.amenities.*') },
        { name: 'Resources & Blog', href: route('admin.resources.index'), icon: FileText, current: route().current('admin.resources.*') },
        { name: 'eBooks', href: route('admin.ebooks.index'), icon: BookOpen, current: route().current('admin.ebooks.*') },
        { name: 'Partners', href: route('admin.partners.index'), icon: Handshake, current: route().current('admin.partners.*') },
        { name: 'Media Orders', href: route('admin.media-orders.index'), icon: Package, current: route().current('admin.media-orders.*') },
        { name: 'Activity', href: route('admin.activity.index'), icon: Activity, current: route().current('admin.activity.*') },
        { name: 'Settings', href: route('admin.settings.index'), icon: Settings, current: route().current('admin.settings.*') },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] transform transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                        <Link href="/" className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-[#1A1816]" />
                            <span className="text-white font-bold text-lg">
                                Admin Panel
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    item.current
                                        ? 'bg-[#1A1816] text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1A1816] rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1
                                className="text-xl font-semibold text-gray-900"
                               
                            >
                                {title || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Site Link */}
                            <Link
                                href="/"
                                className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                                <Home className="w-4 h-4" />
                                View Site
                            </Link>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#1A1816] rounded-full" />
                            </button>

                            {/* User dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <div className="w-8 h-8 bg-[#1A1816] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Profile Settings
                                                </Link>
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Sign Out
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
