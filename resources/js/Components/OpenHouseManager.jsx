import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Calendar, Clock, Plus, Edit3, Trash2, X, Check } from 'lucide-react';

export default function OpenHouseManager({ property, openHouses = [], routePrefix = 'dashboard.listings' }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const emptyForm = { date: '', start_time: '', end_time: '', description: '' };
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const isAdmin = routePrefix === 'admin.properties';

    const getStoreRoute = () => {
        if (isAdmin) return route('admin.properties.open-houses.store', property.id);
        return route('dashboard.listings.open-houses.store', property.id);
    };

    const getUpdateRoute = (openHouseId) => {
        if (isAdmin) return route('admin.properties.open-houses.update', [property.id, openHouseId]);
        return route('dashboard.listings.open-houses.update', [property.id, openHouseId]);
    };

    const getDestroyRoute = (openHouseId) => {
        if (isAdmin) return route('admin.properties.open-houses.destroy', [property.id, openHouseId]);
        return route('dashboard.listings.open-houses.destroy', [property.id, openHouseId]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const url = editingId ? getUpdateRoute(editingId) : getStoreRoute();
        const method = editingId ? 'put' : 'post';

        router[method](url, form, {
            preserveScroll: true,
            onSuccess: () => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
                setSaving(false);
            },
            onError: (errs) => {
                setErrors(errs);
                setSaving(false);
            },
        });
    };

    const handleEdit = (openHouse) => {
        setForm({
            date: openHouse.date ? openHouse.date.split('T')[0] : '',
            start_time: openHouse.start_time ? openHouse.start_time.substring(0, 5) : '',
            end_time: openHouse.end_time ? openHouse.end_time.substring(0, 5) : '',
            description: openHouse.description || '',
        });
        setEditingId(openHouse.id);
        setShowForm(true);
        setErrors({});
    };

    const handleDelete = (openHouseId) => {
        if (!confirm('Are you sure you want to remove this open house?')) return;
        setDeleting(openHouseId);

        router.delete(getDestroyRoute(openHouseId), {
            preserveScroll: true,
            onFinish: () => setDeleting(null),
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setErrors({});
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour12}:${m} ${ampm}`;
    };

    const isPast = (dateStr) => {
        if (!dateStr) return false;
        return new Date(dateStr + 'T23:59:59') < new Date();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                    <Calendar className="w-5 h-5 text-[#0891B2]" />
                    Open Houses
                </h2>
                {!showForm && (
                    <button
                        type="button"
                        onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0891B2] text-white rounded-lg text-sm font-medium hover:bg-[#0E7490] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Open House
                    </button>
                )}
            </div>

            {/* Existing Open Houses */}
            {openHouses.length > 0 && (
                <div className="space-y-3 mb-4">
                    {openHouses.map((oh) => (
                        <div
                            key={oh.id}
                            className={`flex items-center justify-between p-4 rounded-xl border ${
                                isPast(oh.date ? oh.date.split('T')[0] : oh.date)
                                    ? 'bg-gray-50 border-gray-200 opacity-60'
                                    : 'bg-green-50 border-green-200'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${isPast(oh.date ? oh.date.split('T')[0] : oh.date) ? 'bg-gray-200' : 'bg-green-200'}`}>
                                    <Calendar className={`w-5 h-5 ${isPast(oh.date ? oh.date.split('T')[0] : oh.date) ? 'text-gray-500' : 'text-green-700'}`} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(oh.date ? oh.date.split('T')[0] : oh.date)}
                                        {isPast(oh.date ? oh.date.split('T')[0] : oh.date) && (
                                            <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Past</span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatTime(oh.start_time ? oh.start_time.substring(0, 5) : '')} - {formatTime(oh.end_time ? oh.end_time.substring(0, 5) : '')}
                                    </p>
                                    {oh.description && (
                                        <p className="text-sm text-gray-500 mt-1">{oh.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(oh)}
                                    className="p-2 text-gray-400 hover:text-[#0891B2] hover:bg-white rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(oh.id)}
                                    disabled={deleting === oh.id}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {openHouses.length === 0 && !showForm && (
                <p className="text-sm text-gray-400 mb-4">No open houses scheduled. Add one to attract more buyers!</p>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="border border-[#0891B2]/20 rounded-xl p-4 bg-red-50/30">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        {editingId ? 'Edit Open House' : 'New Open House'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                            <input
                                type="time"
                                value={form.start_time}
                                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] ${errors.start_time ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                            <input
                                type="time"
                                value={form.end_time}
                                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] ${errors.end_time ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="e.g., Light refreshments provided, come meet the owner!"
                            maxLength={500}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0891B2] text-white rounded-lg text-sm font-medium hover:bg-[#0E7490] transition-colors disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
