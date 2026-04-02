import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import Header from '@/Components/Header';
import {
    LayoutDashboard,
    Home,
    MessageSquare,
    Heart,
    User,
    LogOut,
    Mail,
    Lock,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle,
    AlertTriangle,
    Shield,
    Camera,
    Menu,
    X,
    Phone
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const navigation = [
        { name: 'Overview', href: route('dashboard'), icon: LayoutDashboard, current: false },
        { name: 'My Listings', href: route('dashboard.listings'), icon: Home, current: false },
        { name: 'Messages', href: route('dashboard.messages'), icon: MessageSquare, current: false },
        { name: 'Saved Properties', href: route('dashboard.favorites'), icon: Heart, current: false },
        { name: 'Profile', href: route('profile.edit'), icon: User, current: true },
    ];

    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        patch: updateProfile,
        errors: profileErrors,
        processing: profileProcessing,
        recentlySuccessful: profileSuccess
    } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });

    // Password form
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        errors: passwordErrors,
        processing: passwordProcessing,
        recentlySuccessful: passwordSuccess,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Delete form
    const {
        data: deleteData,
        setData: setDeleteData,
        delete: deleteAccount,
        processing: deleteProcessing,
        errors: deleteErrors,
        reset: resetDelete,
        clearErrors: clearDeleteErrors
    } = useForm({
        password: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfile(route('profile.update'));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
            onError: (errors) => {
                if (errors.password) {
                    resetPassword('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    resetPassword('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        deleteAccount(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
            onFinish: () => resetDelete(),
        });
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        clearDeleteErrors();
        resetDelete();
    };

    const tabs = [
        { key: 'profile', label: 'Profile Information', icon: User },
        { key: 'password', label: 'Change Password', icon: Lock },
        { key: 'delete', label: 'Delete Account', icon: Trash2 },
    ];

    return (
        <div className="min-h-screen bg-[#F8F7F5]">
            <Head title="Profile Settings" />

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
                                <span className="font-medium">{item.name}</span>
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
                            Profile Settings
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
                        {/* Left Sidebar - Profile Card & Tabs */}
                        <div className="xl:w-72 flex-shrink-0">
                            {/* Profile Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-[#1A1816] text-3xl font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#555] transition-colors border border-gray-200">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h2 className="mt-4 text-lg font-semibold text-gray-900">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    {user.role === 'admin' && (
                                        <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-[#1A1816]/10 text-[#1A1816] text-xs font-medium rounded-full">
                                            <Shield className="w-3 h-3" />
                                            Administrator
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                {tabs.map((tab) => {
                                    const TabIcon = tab.icon;
                                    const isDelete = tab.key === 'delete';
                                    const isActive = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                                                isActive && !isDelete
                                                    ? 'bg-[#1A1816] text-white'
                                                    : isActive && isDelete
                                                    ? 'bg-red-600 text-white'
                                                    : isDelete
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                           
                                        >
                                            <TabIcon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {/* Profile Information */}
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-[#1A1816]/10 rounded-xl flex items-center justify-center">
                                            <User className="w-6 h-6 text-[#1A1816]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Profile Information
                                            </h2>
                                            <p className="text-sm text-gray-500">Update your account's profile information and email address</p>
                                        </div>
                                    </div>

                                    {profileSuccess && (
                                        <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                                            <CheckCircle className="w-5 h-5" />
                                            Profile updated successfully!
                                        </div>
                                    )}

                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData('name', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-colors"
                                                        required
                                                    />
                                                </div>
                                                {profileErrors.name && (
                                                    <p className="mt-2 text-sm text-red-600">{profileErrors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData('phone', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-colors"
                                                        placeholder="(555) 123-4567"
                                                    />
                                                </div>
                                                {profileErrors.phone && (
                                                    <p className="mt-2 text-sm text-red-600">{profileErrors.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData('email', e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-colors"
                                                    required
                                                />
                                            </div>
                                            {profileErrors.email && (
                                                <p className="mt-2 text-sm text-red-600">{profileErrors.email}</p>
                                            )}
                                        </div>

                                        {mustVerifyEmail && user.email_verified_at === null && (
                                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-yellow-800">
                                                            Your email address is unverified.
                                                        </p>
                                                        <Link
                                                            href={route('verification.send')}
                                                            method="post"
                                                            as="button"
                                                            className="text-sm text-[#1A1816] hover:underline mt-1"
                                                        >
                                                            Click here to re-send the verification email.
                                                        </Link>
                                                        {status === 'verification-link-sent' && (
                                                            <p className="mt-2 text-sm text-green-600">
                                                                A new verification link has been sent to your email address.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end pt-4 border-t border-gray-100">
                                            <button
                                                type="submit"
                                                disabled={profileProcessing}
                                                className="px-8 py-3 bg-[#1A1816] text-white rounded-xl hover:bg-[#111111] transition-colors disabled:opacity-50 font-medium"
                                               
                                            >
                                                {profileProcessing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Change Password */}
                            {activeTab === 'password' && (
                                <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-[#1A1816]/10 rounded-xl flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-[#1A1816]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Change Password
                                            </h2>
                                            <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure</p>
                                        </div>
                                    </div>

                                    {passwordSuccess && (
                                        <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                                            <CheckCircle className="w-5 h-5" />
                                            Password updated successfully!
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    ref={currentPasswordInput}
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                    className="w-full pl-12 pr-14 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-colors"
                                                    autoComplete="current-password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {passwordErrors.current_password && (
                                                <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        ref={passwordInput}
                                                        value={passwordData.password}
                                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                                        className="w-full pl-12 pr-14 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-colors"
                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {passwordErrors.password && (
                                                    <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={passwordData.password_confirmation}
                                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                        className="w-full pl-12 pr-14 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-colors"
                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {passwordErrors.password_confirmation && (
                                                    <p className="mt-2 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-gray-100">
                                            <button
                                                type="submit"
                                                disabled={passwordProcessing}
                                                className="px-8 py-3 bg-[#1A1816] text-white rounded-xl hover:bg-[#111111] transition-colors disabled:opacity-50 font-medium"
                                               
                                            >
                                                {passwordProcessing ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Delete Account */}
                            {activeTab === 'delete' && (
                                <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <Trash2 className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Delete Account
                                            </h2>
                                            <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-red-50 border border-red-200 rounded-xl mb-6">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-red-800 font-semibold">Warning: This action cannot be undone</p>
                                                <p className="text-sm text-red-700 mt-1">
                                                    Once your account is deleted, all of its resources and data will be permanently deleted.
                                                    This includes your profile, listings, messages, and any other information associated with your account.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6">
                                        Before deleting your account, please download any data or information that you wish to retain.
                                        If you have any active listings, they will also be removed.
                                    </p>

                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                                       
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Delete Account
                            </h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action is permanent and cannot be undone.
                            Please enter your password to confirm.
                        </p>

                        <form onSubmit={handleDeleteSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showDeletePassword ? 'text' : 'password'}
                                        value={deleteData.password}
                                        onChange={(e) => setDeleteData('password', e.target.value)}
                                        className="w-full pl-12 pr-14 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {deleteErrors.password && (
                                    <p className="mt-2 text-sm text-red-600">{deleteErrors.password}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteProcessing}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                                >
                                    {deleteProcessing ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

Edit.layout = (page) => page;
