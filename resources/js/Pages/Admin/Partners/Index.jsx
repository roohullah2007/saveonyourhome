import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, X, CheckCircle, XCircle, Phone, Mail, Globe, MapPin } from 'lucide-react';

export default function PartnersIndex({ partners = [], categories = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [partnerToDelete, setPartnerToDelete] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        description: '',
        sort_order: 0,
        is_active: true,
    });
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            phone: '',
            email: '',
            website: '',
            address: '',
            description: '',
            sort_order: 0,
            is_active: true,
        });
        setEditingPartner(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name || '',
            category: partner.category || '',
            phone: partner.phone || '',
            email: partner.email || '',
            website: partner.website || '',
            address: partner.address || '',
            description: partner.description || '',
            sort_order: partner.sort_order || 0,
            is_active: partner.is_active ?? true,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const onFinish = () => {
            setSubmitting(false);
            setShowModal(false);
            resetForm();
        };

        if (editingPartner) {
            router.put(route('admin.partners.update', editingPartner.id), formData, {
                preserveScroll: true,
                onSuccess: onFinish,
                onError: () => setSubmitting(false),
            });
        } else {
            router.post(route('admin.partners.store'), formData, {
                preserveScroll: true,
                onSuccess: onFinish,
                onError: () => setSubmitting(false),
            });
        }
    };

    const confirmDelete = (partner) => {
        setPartnerToDelete(partner);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!partnerToDelete) return;
        router.delete(route('admin.partners.destroy', partnerToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setPartnerToDelete(null);
            },
        });
    };

    const filteredPartners = filterCategory === 'all'
        ? partners
        : partners.filter((p) => p.category === filterCategory);

    return (
        <>
            <Head title="Partners - Admin" />
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
                        <p className="text-gray-500">Manage trusted vendor partners displayed on the public Partners page.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Partner
                    </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-[#1A1816] focus:ring-0 outline-none"
                    >
                        <option value="all">All Categories ({partners.length})</option>
                        {categories.map((cat) => {
                            const count = partners.filter((p) => p.category === cat).length;
                            return (
                                <option key={cat} value={cat}>
                                    {cat} ({count})
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Partners Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    {filteredPartners.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No partners yet. Click "Add Partner" to create one.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Category</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPartners.map((partner) => (
                                        <tr key={partner.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{partner.name}</div>
                                                {partner.description && (
                                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{partner.description}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{partner.category}</td>
                                            <td className="px-4 py-3 text-xs text-gray-600 space-y-0.5">
                                                {partner.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {partner.phone}</div>}
                                                {partner.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {partner.email}</div>}
                                                {partner.website && <div className="flex items-center gap-1"><Globe className="w-3 h-3" /> {partner.website}</div>}
                                            </td>
                                            <td className="px-4 py-3">
                                                {partner.is_active ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                                                        <CheckCircle className="w-3 h-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                        <XCircle className="w-3 h-3" /> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => openEditModal(partner)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors mr-1">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => confirmDelete(partner)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">{editingPartner ? 'Edit Partner' : 'Add Partner'}</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1A1816] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-[#1A1816] outline-none">
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1A1816] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1A1816] outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input type="text" placeholder="https://example.com or www.example.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1A1816] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1A1816] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1A1816] outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                    <input type="number" min="0" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1A1816] outline-none" />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
                                        <span className="text-sm font-medium text-gray-700">Active (visible on public page)</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#3355FF] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50">{submitting ? 'Saving...' : (editingPartner ? 'Update' : 'Create')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Partner</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{partnerToDelete?.name}</strong>? This cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

PartnersIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
