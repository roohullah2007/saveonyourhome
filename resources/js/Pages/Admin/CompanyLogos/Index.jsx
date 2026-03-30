import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Plus,
    Edit,
    Trash2,
    GripVertical,
    X,
    Save,
    ImageIcon,
    Type,
    ExternalLink,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

export default function CompanyLogosIndex({ logos = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingLogo, setEditingLogo] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [logoToDelete, setLogoToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        text_logo: '',
        text_color: '',
        text_size: '',
        link_url: '',
        hover_color: '',
        sort_order: logos.length + 1,
        is_active: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setFormData({
            name: '',
            text_logo: '',
            text_color: '',
            text_size: '',
            link_url: '',
            hover_color: '',
            sort_order: logos.length + 1,
            is_active: true,
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingLogo(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (logo) => {
        setEditingLogo(logo);
        setFormData({
            name: logo.name || '',
            text_logo: logo.text_logo || '',
            text_color: logo.text_color || '',
            text_size: logo.text_size || '',
            link_url: logo.link_url || '',
            hover_color: logo.hover_color || '',
            sort_order: logo.sort_order || 0,
            is_active: logo.is_active ?? true,
        });
        setImagePreview(logo.image_path || null);
        setImageFile(null);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('text_logo', formData.text_logo);
        data.append('text_color', formData.text_color);
        data.append('text_size', formData.text_size);
        data.append('link_url', formData.link_url);
        data.append('hover_color', formData.hover_color);
        data.append('sort_order', formData.sort_order);
        data.append('is_active', formData.is_active ? '1' : '0');
        if (imageFile) {
            data.append('image', imageFile);
        }

        if (editingLogo) {
            data.append('_method', 'PUT');
            router.post(route('admin.company-logos.update', editingLogo.id), data, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                },
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post(route('admin.company-logos.store'), data, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                },
                onFinish: () => setSubmitting(false),
            });
        }
    };

    const deleteLogo = () => {
        if (logoToDelete) {
            router.delete(route('admin.company-logos.destroy', logoToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setLogoToDelete(null);
                }
            });
        }
    };

    const moveUp = (index) => {
        if (index === 0) return;
        const newOrder = [...logos];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        router.post(route('admin.company-logos.reorder'), {
            ids: newOrder.map(l => l.id),
        }, { preserveScroll: true });
    };

    const moveDown = (index) => {
        if (index >= logos.length - 1) return;
        const newOrder = [...logos];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        router.post(route('admin.company-logos.reorder'), {
            ids: newOrder.map(l => l.id),
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Company Logos">
            <Head title="Company Logos - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        Company Logos
                    </h1>
                    <p className="text-gray-500">Manage company logos displayed across the website (MLS syndication partners)</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 bg-[#0891B2] text-white px-4 py-2 rounded-lg hover:bg-[#0E7490] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Logo
                </button>
            </div>

            {/* Logos Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-12">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {logos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    No company logos yet. Click "Add Logo" to create one.
                                </td>
                            </tr>
                        ) : (
                            logos.map((logo, index) => (
                                <tr key={logo.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => moveUp(index)}
                                                disabled={index === 0}
                                                className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                                title="Move up"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <span className="text-xs text-gray-400 text-center">{logo.sort_order}</span>
                                            <button
                                                onClick={() => moveDown(index)}
                                                disabled={index >= logos.length - 1}
                                                className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                                title="Move down"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-10 w-20 flex items-center justify-center bg-gray-50 rounded-lg">
                                            {logo.image_path ? (
                                                <img src={logo.image_path} alt={logo.name} className="h-8 w-auto object-contain" />
                                            ) : logo.text_logo ? (
                                                <span
                                                    className={`font-bold ${logo.text_size || 'text-sm'}`}
                                                    style={{ color: logo.text_color || '#333' }}
                                                >
                                                    {logo.text_logo}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No logo</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{logo.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {logo.image_path ? (
                                            <span className="inline-flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1"><Type className="w-3 h-3" /> Text</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                            logo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {logo.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(logo)}
                                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setLogoToDelete(logo); setShowDeleteModal(true); }}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingLogo ? 'Edit Logo' : 'Add Logo'}
                            </h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                    placeholder="e.g., Zillow"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0891B2]/10 file:text-[#0891B2] hover:file:bg-[#0891B2]/20"
                                />
                                {imagePreview && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
                                        <img src={imagePreview} alt="Preview" className="h-12 w-auto object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-500 mb-3">Or use text as logo (if no image):</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Logo</label>
                                        <input
                                            type="text"
                                            value={formData.text_logo}
                                            onChange={e => setFormData({ ...formData, text_logo: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                            placeholder="e.g., homes.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                                        <input
                                            type="text"
                                            value={formData.text_color}
                                            onChange={e => setFormData({ ...formData, text_color: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                            placeholder="e.g., #FF6B00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Size</label>
                                        <select
                                            value={formData.text_size}
                                            onChange={e => setFormData({ ...formData, text_size: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                        >
                                            <option value="">Default</option>
                                            <option value="text-sm">Small</option>
                                            <option value="text-base">Medium</option>
                                            <option value="text-lg">Large</option>
                                            <option value="text-xl">Extra Large</option>
                                            <option value="text-2xl">2X Large</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                                    <input
                                        type="url"
                                        value={formData.link_url}
                                        onChange={e => setFormData({ ...formData, link_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hover Color</label>
                                    <input
                                        type="text"
                                        value={formData.hover_color}
                                        onChange={e => setFormData({ ...formData, hover_color: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                        placeholder="e.g., #006AFF"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-[#0891B2] border-gray-300 rounded focus:ring-[#0891B2]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {submitting ? 'Saving...' : (editingLogo ? 'Update' : 'Create')}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Logo</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <strong>{logoToDelete?.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowDeleteModal(false); setLogoToDelete(null); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={deleteLogo} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

CompanyLogosIndex.layout = (page) => page;
