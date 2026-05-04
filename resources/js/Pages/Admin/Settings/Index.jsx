import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Settings,
    Save,
    Plus,
    Trash2,
    RefreshCw,
    Globe,
    Home,
    Mail,
    Search as SearchIcon,
    Calculator,
    X,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

export default function SettingsIndex({ settings = {} }) {
    const [activeTab, setActiveTab] = useState('general');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [settingToDelete, setSettingToDelete] = useState(null);
    const [localSettings, setLocalSettings] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const tabs = [
        { key: 'general', label: 'General', icon: Globe },
        { key: 'property', label: 'Property', icon: Home },
        { key: 'email', label: 'Email', icon: Mail },
        { key: 'seo', label: 'SEO', icon: SearchIcon },
        { key: 'mortgage', label: 'Mortgage', icon: Calculator },
    ];

    // Initialize local settings from props
    useEffect(() => {
        const flatSettings = {};
        Object.values(settings).forEach(group => {
            if (Array.isArray(group)) {
                group.forEach(setting => {
                    flatSettings[setting.key] = setting.value;
                });
            }
        });
        setLocalSettings(flatSettings);
    }, [settings]);

    const handleSettingChange = (key, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
        setSuccessMessage('');
    };

    const saveSettings = () => {
        setSaving(true);
        const settingsArray = Object.entries(localSettings).map(([key, value]) => ({
            key,
            value: value?.toString() || ''
        }));

        router.post(route('admin.settings.update'), {
            settings: settingsArray
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setHasChanges(false);
                setSaving(false);
                setSuccessMessage('Settings saved successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: () => {
                setSaving(false);
            }
        });
    };

    const initializeDefaults = () => {
        router.post(route('admin.settings.initialize'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Default settings initialized!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        });
    };

    const deleteSetting = () => {
        if (settingToDelete) {
            router.delete(route('admin.settings.destroy', settingToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSettingToDelete(null);
                }
            });
        }
    };

    const { data: newSetting, setData: setNewSetting, post: createSetting, processing, reset } = useForm({
        key: '',
        value: '',
        type: 'string',
        group: 'general',
        label: '',
        description: ''
    });

    const handleCreateSetting = (e) => {
        e.preventDefault();
        createSetting(route('admin.settings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    const getSettingsByGroup = (group) => {
        return settings[group] || [];
    };

    const renderSettingInput = (setting) => {
        const value = localSettings[setting.key] ?? setting.value ?? '';

        switch (setting.type) {
            case 'boolean':
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value === '1' || value === true || value === 'true'}
                            onChange={(e) => handleSettingChange(setting.key, e.target.checked ? '1' : '0')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1A1816]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A1816]"></div>
                    </label>
                );
            case 'integer':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                    />
                );
            case 'json':
                return (
                    <textarea
                        value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] font-mono text-sm"
                        placeholder="Enter valid JSON..."
                    />
                );
            default:
                if (setting.key.includes('description') || setting.key.includes('address')) {
                    return (
                        <textarea
                            value={value}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                        />
                    );
                }
                if (setting.key.endsWith('_email') || setting.key === 'contact_email') {
                    return (
                        <input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            value={value}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                        />
                    );
                }
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                    />
                );
        }
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [sendingTest, setSendingTest] = useState(false);

    const sendTestEmail = () => {
        if (hasChanges) {
            if (!window.confirm('You have unsaved changes. Save them first, then send the test? Click Cancel to send using the currently saved address.')) return;
        }
        setSendingTest(true);
        setErrorMessage('');
        setSuccessMessage('');
        router.post(route('admin.settings.test-email'), {}, {
            preserveScroll: true,
            onFinish: () => setSendingTest(false),
            onSuccess: (page) => {
                const flash = page?.props?.flash || {};
                if (flash.success) {
                    setSuccessMessage(flash.success);
                    setTimeout(() => setSuccessMessage(''), 6000);
                }
                if (flash.error) {
                    setErrorMessage(flash.error);
                    setTimeout(() => setErrorMessage(''), 8000);
                }
            },
            onError: () => {
                setErrorMessage('Could not send test email. Check the server log.');
                setTimeout(() => setErrorMessage(''), 8000);
            },
        });
    };

    const currentSettings = getSettingsByGroup(activeTab);
    const isEmpty = Object.keys(settings).length === 0 || Object.values(settings).every(g => !g || g.length === 0);

    return (
        <AdminLayout title="Settings">
            <Head title="Settings - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Settings
                    </h1>
                    <p className="text-gray-500">Manage your website configuration</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={initializeDefaults}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Initialize Defaults
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Setting
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 flex items-start gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Empty State */}
            {isEmpty ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Settings Found</h3>
                    <p className="text-gray-500 mb-6">Get started by initializing default settings or adding custom ones.</p>
                    <button
                        onClick={initializeDefaults}
                        className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Initialize Default Settings
                    </button>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {tabs.map((tab) => {
                            const TabIcon = tab.icon;
                            const count = getSettingsByGroup(tab.key).length;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeTab === tab.key
                                            ? 'bg-[#3355FF] text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <TabIcon className="w-4 h-4" />
                                    {tab.label}
                                    {count > 0 && (
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            activeTab === tab.key
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Settings Form */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 capitalize">{activeTab} Settings</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Configure your {activeTab.toLowerCase()} preferences
                            </p>
                        </div>

                        {currentSettings.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No settings in this category</p>
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                {currentSettings.map((setting) => (
                                    <div key={setting.id} className="flex flex-col sm:flex-row sm:items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                                {setting.label || setting.key}
                                            </label>
                                            {setting.description && (
                                                <p className="text-xs text-gray-500 mb-2">{setting.description}</p>
                                            )}
                                            <p className="text-xs text-gray-400 font-mono">Key: {setting.key}</p>
                                        </div>
                                        <div className="sm:w-1/2 flex flex-col gap-2">
                                            <div className="flex items-start gap-2">
                                                <div className="flex-1">
                                                    {renderSettingInput(setting)}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSettingToDelete(setting);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg flex-shrink-0"
                                                    title="Delete Setting"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {setting.key === 'admin_email' && (
                                                <button
                                                    type="button"
                                                    onClick={sendTestEmail}
                                                    disabled={sendingTest}
                                                    className="self-start inline-flex items-center gap-2 text-xs font-semibold text-[#3355FF] hover:text-[#1D4ED8] underline-offset-2 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {sendingTest ? 'Sending…' : 'Send test email to this address'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Save Button */}
                        {currentSettings.length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-xl">
                                <p className="text-sm text-gray-500">
                                    {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
                                </p>
                                <button
                                    onClick={saveSettings}
                                    disabled={!hasChanges || saving}
                                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                                        hasChanges
                                            ? 'bg-[#3355FF] text-white hover:bg-[#1D4ED8]'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Add Setting Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Setting</h3>
                            <button
                                onClick={() => { setShowAddModal(false); reset(); }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSetting} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Key *</label>
                                    <input
                                        type="text"
                                        value={newSetting.key}
                                        onChange={(e) => setNewSetting('key', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                        placeholder="setting_key"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={newSetting.label}
                                        onChange={(e) => setNewSetting('label', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                        placeholder="Display Label"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                    <select
                                        value={newSetting.type}
                                        onChange={(e) => setNewSetting('type', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    >
                                        <option value="string">String</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="integer">Integer</option>
                                        <option value="json">JSON</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Group *</label>
                                    <select
                                        value={newSetting.group}
                                        onChange={(e) => setNewSetting('group', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    >
                                        <option value="general">General</option>
                                        <option value="property">Property</option>
                                        <option value="email">Email</option>
                                        <option value="seo">SEO</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input
                                    type="text"
                                    value={newSetting.value}
                                    onChange={(e) => setNewSetting('value', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    placeholder="Setting value"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newSetting.description}
                                    onChange={(e) => setNewSetting('description', e.target.value)}
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); reset(); }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#3355FF] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Setting'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Setting</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <strong>{settingToDelete?.label || settingToDelete?.key}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setSettingToDelete(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteSetting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

SettingsIndex.layout = (page) => page;
