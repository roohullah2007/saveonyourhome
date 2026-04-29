import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Plus, Edit2, Trash2, Check, X, ArrowUp, ArrowDown, Eye, EyeOff, ChevronDown, Layers, Search,
} from 'lucide-react';

// ---------- Small helpers ----------

function ItemRow({ item, onEdit, onDelete, onToggle, onMoveUp, onMoveDown, isFirst, isLast }) {
    return (
        <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <div className="flex flex-col text-gray-400">
                <button type="button" onClick={onMoveUp} disabled={isFirst} className="hover:text-gray-700 disabled:opacity-30 h-4"><ArrowUp className="w-3 h-3" /></button>
                <button type="button" onClick={onMoveDown} disabled={isLast} className="hover:text-gray-700 disabled:opacity-30 h-4"><ArrowDown className="w-3 h-3" /></button>
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{item.label}</div>
                <div className="text-[11px] text-gray-500 truncate flex items-center gap-2">
                    <span className="font-mono text-gray-400">{item.key}</span>
                    {item.sub_label && (
                        <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">{item.sub_label}</span>
                    )}
                </div>
            </div>
            <button
                onClick={() => onToggle(!item.is_active)}
                title={item.is_active ? 'Hide from forms' : 'Show on forms'}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${item.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
            >
                {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button onClick={onEdit} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600"><Edit2 className="w-4 h-4" /></button>
            <button onClick={onDelete} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
        </div>
    );
}

// ---------- Term modal ----------

function TermModal({ open, mode, category, term, onClose }) {
    // mode: 'category' | 'item'
    const editing = !!term;
    const isItem = mode === 'item';

    const form = useForm({
        type: isItem ? 'amenity' : 'amenity_category',
        parent_id: isItem ? category?.id ?? null : null,
        key: term?.key || '',
        label: term?.label || '',
        sub_label: term?.sub_label || '',
        is_active: term?.is_active ?? true,
        sort_order: term?.sort_order ?? null,
    });

    React.useEffect(() => {
        if (open) {
            form.setData({
                type: isItem ? 'amenity' : 'amenity_category',
                parent_id: isItem ? category?.id ?? null : null,
                key: term?.key || '',
                label: term?.label || '',
                sub_label: term?.sub_label || '',
                is_active: term?.is_active ?? true,
                sort_order: term?.sort_order ?? null,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, term, category?.id]);

    if (!open) return null;

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (editing) form.put(route('admin.taxonomies.update', term.id), opts);
        else form.post(route('admin.taxonomies.store'), opts);
    };

    const heading = editing
        ? (isItem ? 'Edit amenity' : 'Edit category')
        : (isItem ? `Add item to ${category?.label || 'category'}` : 'Add category');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <form onSubmit={submit} className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold">{heading}</h2>
                    <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Label</label>
                        <input
                            required
                            type="text"
                            value={form.data.label}
                            onChange={(e) => form.setData('label', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
                            placeholder={isItem ? 'e.g. Hardwood Floors' : 'e.g. Interior Features'}
                        />
                        {form.errors.label && <p className="text-xs text-red-600 mt-1">{form.errors.label}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Key {editing ? '' : <span className="normal-case font-normal text-[10px] text-gray-400">(optional — auto-generated from label)</span>}
                        </label>
                        <input
                            type="text"
                            value={form.data.key}
                            onChange={(e) => form.setData('key', e.target.value.replace(/[^a-z0-9_-]/gi, '-').toLowerCase())}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
                            placeholder={isItem ? 'hardwood_floors' : 'interior_features'}
                        />
                        <p className="text-[11px] text-gray-500 mt-1">Changing the key after use may orphan existing listings.</p>
                        {form.errors.key && <p className="text-xs text-red-600 mt-1">{form.errors.key}</p>}
                    </div>

                    {isItem && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Sub-group label <span className="normal-case font-normal text-[10px] text-gray-400">(optional — e.g. Appliances, Cabinetry)</span>
                            </label>
                            <input
                                type="text"
                                value={form.data.sub_label || ''}
                                onChange={(e) => form.setData('sub_label', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
                                placeholder="Appliances"
                            />
                            <p className="text-[11px] text-gray-500 mt-1">Items in the same category sharing a sub-group label render under one heading on listing forms (used by Kitchen Features).</p>
                        </div>
                    )}

                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                        <span>Active (show on public + seller forms)</span>
                    </label>
                </div>
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" disabled={form.processing} className="px-4 py-2 bg-[#3355FF] text-white rounded-lg disabled:opacity-50 inline-flex items-center gap-2 font-semibold">
                        <Check className="w-4 h-4" /> {form.processing ? 'Saving…' : (editing ? 'Update' : 'Create')}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ---------- Page ----------

export default function AmenitiesIndex({ amenityTree = [] }) {
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState('all'); // 'all' | category id
    const [openIds, setOpenIds] = useState(() => amenityTree.map((g) => g.category.id));
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'category' | 'item'
    const [modalCategory, setModalCategory] = useState(null);
    const [modalTerm, setModalTerm] = useState(null);

    const toggle = (id) =>
        setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

    // When admin clicks a specific category tab, auto-expand that card so items show immediately.
    React.useEffect(() => {
        if (tab !== 'all' && !openIds.includes(tab)) {
            setOpenIds((prev) => [...prev, tab]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const filteredTree = useMemo(() => {
        const q = query.trim().toLowerCase();
        const scoped = tab === 'all'
            ? amenityTree
            : amenityTree.filter((g) => g.category.id === tab);
        if (!q) return scoped;
        return scoped
            .map((g) => {
                const cat = g.category;
                const catMatch = cat.label.toLowerCase().includes(q);
                const items = (g.items || []).filter((i) =>
                    i.label.toLowerCase().includes(q) ||
                    (i.sub_label || '').toLowerCase().includes(q)
                );
                if (catMatch || items.length > 0) return { category: cat, items: catMatch ? g.items : items };
                return null;
            })
            .filter(Boolean);
    }, [amenityTree, query, tab]);

    const openAddCategory = () => {
        setModalMode('category');
        setModalCategory(null);
        setModalTerm(null);
        setModalOpen(true);
    };
    const openEditCategory = (cat) => {
        setModalMode('category');
        setModalCategory(null);
        setModalTerm(cat);
        setModalOpen(true);
    };
    const openAddItem = (cat) => {
        setModalMode('item');
        setModalCategory(cat);
        setModalTerm(null);
        setModalOpen(true);
        if (!openIds.includes(cat.id)) setOpenIds((p) => [...p, cat.id]);
    };
    const openEditItem = (cat, item) => {
        setModalMode('item');
        setModalCategory(cat);
        setModalTerm(item);
        setModalOpen(true);
    };

    const toggleActive = (term, value) => {
        router.put(route('admin.taxonomies.update', term.id), {
            type: term.type,
            parent_id: term.parent_id ?? null,
            label: term.label,
            key: term.key,
            sub_label: term.sub_label ?? null,
            is_active: value,
            sort_order: term.sort_order,
        }, { preserveScroll: true });
    };

    const deleteTerm = (term, warning = '') => {
        if (!confirm(`Remove "${term.label}"? ${warning}`)) return;
        router.delete(route('admin.taxonomies.destroy', term.id), { preserveScroll: true });
    };

    const move = (term, direction, siblings) => {
        const list = [...siblings];
        const idx = list.findIndex((t) => t.id === term.id);
        if (idx < 0) return;
        const swap = idx + direction;
        if (swap < 0 || swap >= list.length) return;
        [list[idx], list[swap]] = [list[swap], list[idx]];
        const ids = list.map((t) => t.id);
        router.post(route('admin.taxonomies.reorder'), { type: term.type, ids }, { preserveScroll: true });
    };

    const moveCategory = (cat, direction) => {
        const siblings = amenityTree.map((g) => g.category);
        move(cat, direction, siblings);
    };

    return (
        <>
            <Head title="Amenities — Admin" />
            <div>
                <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-6 h-6 text-[#3355FF]" /> Amenities & Features
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Add, edit, reorder, or deactivate the amenity categories and individual items sellers pick when listing a property. Changes take effect immediately on the public and seller forms.
                        </p>
                    </div>
                    <button onClick={openAddCategory} className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:opacity-90 font-semibold">
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => setTab('all')}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === 'all' ? 'bg-[#1a1816] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                    >
                        All <span className="opacity-70">({amenityTree.reduce((n, g) => n + (g.items?.length || 0), 0)})</span>
                    </button>
                    {amenityTree.map((g) => (
                        <button
                            key={g.category.id}
                            onClick={() => setTab(g.category.id)}
                            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === g.category.id ? 'bg-[#1a1816] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'} ${!g.category.is_active ? 'opacity-60' : ''}`}
                            title={g.category.is_active ? '' : 'Hidden from seller forms'}
                        >
                            {g.category.label} <span className="opacity-70">({(g.items || []).length})</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-4 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search categories or amenities…"
                        className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
                    />
                </div>

                {/* Tree */}
                <div className="space-y-3">
                    {filteredTree.length === 0 ? (
                        <div className="rounded-xl bg-white border border-gray-200 p-6 text-center text-gray-500">
                            {query ? 'No amenities match your search.' : (
                                <>
                                    <p className="mb-3">No amenity categories yet.</p>
                                    <button onClick={openAddCategory} className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:opacity-90 font-semibold">
                                        <Plus className="w-4 h-4" /> Add the first category
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        filteredTree.map((group, ci) => {
                            const cat = group.category;
                            const items = group.items || [];
                            const isOpen = openIds.includes(cat.id);
                            const activeCount = items.filter((i) => i.is_active).length;
                            const isFirst = ci === 0;
                            const isLast = ci === filteredTree.length - 1;
                            return (
                                <div key={cat.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                                        <div className="flex flex-col text-gray-400">
                                            <button type="button" onClick={() => moveCategory(cat, -1)} disabled={isFirst} className="hover:text-gray-700 disabled:opacity-30 h-4"><ArrowUp className="w-3 h-3" /></button>
                                            <button type="button" onClick={() => moveCategory(cat, 1)} disabled={isLast} className="hover:text-gray-700 disabled:opacity-30 h-4"><ArrowDown className="w-3 h-3" /></button>
                                        </div>
                                        <button type="button" onClick={() => toggle(cat.id)} className="flex-1 flex items-center gap-2 text-left min-w-0">
                                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                                            <span className="font-semibold text-gray-900 truncate">{cat.label}</span>
                                            <span className="text-xs text-gray-500 shrink-0">{activeCount} / {items.length}</span>
                                            {!cat.is_active && <span className="text-xs text-gray-400">(hidden)</span>}
                                        </button>
                                        <button onClick={() => toggleActive(cat, !cat.is_active)} title={cat.is_active ? 'Hide from forms' : 'Show on forms'} className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${cat.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                                            {cat.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => openEditCategory(cat)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => deleteTerm(cat, 'All items in this category will also be removed.')} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    {isOpen && (
                                        <div className="p-3 space-y-2">
                                            {items.length === 0 && <p className="text-sm text-gray-500 px-2 py-4">No items yet.</p>}
                                            {items.map((item, i) => (
                                                <ItemRow
                                                    key={item.id}
                                                    item={item}
                                                    isFirst={i === 0}
                                                    isLast={i === items.length - 1}
                                                    onEdit={() => openEditItem(cat, item)}
                                                    onDelete={() => deleteTerm(item, 'Existing listings using this value will still show the raw key on their records.')}
                                                    onToggle={(v) => toggleActive(item, v)}
                                                    onMoveUp={() => move(item, -1, items)}
                                                    onMoveDown={() => move(item, 1, items)}
                                                />
                                            ))}
                                            <button onClick={() => openAddItem(cat)} className="inline-flex items-center gap-2 text-sm text-[#3355FF] font-semibold px-2 py-1.5 hover:bg-blue-50 rounded-lg">
                                                <Plus className="w-4 h-4" /> Add item to {cat.label}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <TermModal
                open={modalOpen}
                mode={modalMode}
                category={modalCategory}
                term={modalTerm}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}

AmenitiesIndex.layout = (page) => <AdminLayout title="Amenities">{page}</AdminLayout>;
