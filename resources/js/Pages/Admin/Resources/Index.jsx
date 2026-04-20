import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import RichTextEditor from '@/Components/RichTextEditor';
import {
    Plus,
    Edit,
    Trash2,
    X,
    Save,
    FileText,
    Eye,
    EyeOff,
    ImageIcon,
    Upload,
    Sparkles,
    Loader2,
} from 'lucide-react';

export default function ResourcesIndex({ resources = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: 'blog',
        excerpt: '',
        content: '',
        is_published: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // AI draft state
    const [aiTopic, setAiTopic] = useState('');
    const [aiBusy, setAiBusy] = useState(false);
    const [aiError, setAiError] = useState('');

    const generateAiDraft = async () => {
        if (!aiTopic.trim()) {
            setAiError('Tell the AI what the article should be about.');
            return;
        }
        setAiBusy(true);
        setAiError('');
        try {
            const { data } = await axios.post(route('admin.resources.ai-generate'), {
                topic: aiTopic.trim(),
                category: formData.category,
                existing_title: formData.title || null,
            });
            setFormData((prev) => ({
                ...prev,
                title: data.title || prev.title,
                excerpt: data.excerpt || prev.excerpt,
                content: data.content || prev.content,
            }));
        } catch (err) {
            setAiError(err?.response?.data?.error || 'Something went wrong generating the draft.');
        } finally {
            setAiBusy(false);
        }
    };

    const categories = [
        { key: 'all', label: 'All' },
        { key: 'seller', label: 'Seller' },
        { key: 'buyer', label: 'Buyer' },
        { key: 'blog', label: 'Blog' },
    ];

    const filteredResources = activeCategory === 'all'
        ? resources
        : resources.filter(r => r.category === activeCategory);

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'blog',
            excerpt: '',
            content: '',
            is_published: false,
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingResource(null);
        setAiTopic('');
        setAiError('');
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title || '',
            category: resource.category || 'blog',
            excerpt: resource.excerpt || '',
            content: resource.content || '',
            is_published: resource.is_published ?? false,
        });
        setImagePreview(resource.image || null);
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
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('excerpt', formData.excerpt);
        data.append('content', formData.content);
        data.append('is_published', formData.is_published ? '1' : '0');
        if (imageFile) {
            data.append('image', imageFile);
        }

        if (editingResource) {
            data.append('_method', 'PUT');
            router.post(route('admin.resources.update', editingResource.id), data, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                },
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post(route('admin.resources.store'), data, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                },
                onFinish: () => setSubmitting(false),
            });
        }
    };

    const deleteResource = () => {
        if (resourceToDelete) {
            router.delete(route('admin.resources.destroy', resourceToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setResourceToDelete(null);
                },
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const categoryBadgeColor = (category) => {
        switch (category) {
            case 'seller': return 'bg-blue-100 text-blue-700';
            case 'buyer': return 'bg-purple-100 text-purple-700';
            case 'blog': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout title="Resources">
            <Head title="Resources - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
                    <p className="text-gray-500">Manage blog posts and resource articles</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Resource
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeCategory === cat.key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {cat.label}
                        <span className="ml-1.5 text-xs text-gray-400">
                            {cat.key === 'all'
                                ? resources.length
                                : resources.filter(r => r.category === cat.key).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Resources Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Published Date</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredResources.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    No resources found. Click "Add Resource" to create one.
                                </td>
                            </tr>
                        ) : (
                            filteredResources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {resource.image ? (
                                                <img
                                                    src={resource.image}
                                                    alt={resource.title}
                                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{resource.title}</p>
                                                {resource.excerpt && (
                                                    <p className="text-sm text-gray-500 line-clamp-1">{resource.excerpt}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${categoryBadgeColor(resource.category)}`}>
                                            {resource.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                            resource.is_published
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {resource.is_published ? (
                                                <><Eye className="w-3 h-3" /> Published</>
                                            ) : (
                                                <><EyeOff className="w-3 h-3" /> Draft</>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(resource.published_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(resource)}
                                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setResourceToDelete(resource); setShowDeleteModal(true); }}
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
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingResource ? 'Edit Resource' : 'Add Resource'}
                            </h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* AI draft panel */}
                        <div className="mb-5 rounded-xl border border-[#3355FF]/20 bg-gradient-to-br from-[#3355FF]/5 to-[#1A1816]/5 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-[#3355FF]" />
                                <span className="text-sm font-semibold text-gray-900">Draft with AI</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Describe the article you want (topic, angle, audience). The AI will fill in the title, excerpt, and content — you can edit everything before saving.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={aiTopic}
                                    onChange={(e) => setAiTopic(e.target.value)}
                                    placeholder="e.g. How to price your home when you FSBO"
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3355FF]/30 focus:border-[#3355FF] bg-white"
                                    disabled={aiBusy}
                                />
                                <button
                                    type="button"
                                    onClick={generateAiDraft}
                                    disabled={aiBusy}
                                    className="inline-flex items-center justify-center gap-2 bg-[#3355FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1D4ED8] disabled:opacity-60"
                                >
                                    {aiBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    {aiBusy ? 'Drafting…' : 'Generate draft'}
                                </button>
                            </div>
                            {aiError && <p className="text-xs text-red-600 mt-2">{aiError}</p>}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    placeholder="Article title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                >
                                    <option value="seller">Seller</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="blog">Blog</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    placeholder="Brief summary of the article"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(html) => setFormData({ ...formData, content: html })}
                                    placeholder="Write the full article…"
                                    minHeight={280}
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Use the toolbar for bold, italic, and lists.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Featured Image {editingResource ? '' : <span className="text-red-500">*</span>}
                                </label>
                                <label
                                    htmlFor="resource-image-input"
                                    className="block rounded-xl border-2 border-dashed border-gray-200 hover:border-[#3355FF] transition-colors cursor-pointer overflow-hidden bg-gray-50"
                                >
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-2 text-white text-xs font-semibold flex items-center gap-1.5">
                                                <Upload className="w-3.5 h-3.5" />
                                                Click to replace
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                            <ImageIcon className="w-8 h-8 mb-2" />
                                            <p className="text-sm font-semibold">Click to upload a featured image</p>
                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP · up to 2 MB</p>
                                        </div>
                                    )}
                                </label>
                                <input
                                    id="resource-image-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Shown as the hero image on the article detail page and in the grid on /blog, /seller-resources, and /buyer-resources.</p>
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-4 h-4 text-[#1A1816] border-gray-300 rounded focus:ring-[#1A1816]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Published</span>
                                </label>
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
                                    className="px-4 py-2 bg-[#3355FF] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {submitting ? 'Saving...' : (editingResource ? 'Update' : 'Create')}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Resource</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <strong>{resourceToDelete?.title}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setResourceToDelete(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteResource}
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

ResourcesIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
