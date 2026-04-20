import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Check, X, GripVertical, ArrowUp, ArrowDown, Tags, Eye, EyeOff } from 'lucide-react';

function Row({ term, onEdit, onDelete, onToggle, onMove, isFirst, isLast }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <div className="flex flex-col text-gray-400">
        <button type="button" onClick={() => onMove(-1)} disabled={isFirst} className="hover:text-gray-700 disabled:opacity-30 h-4"><ArrowUp className="w-3 h-3" /></button>
        <button type="button" onClick={() => onMove(1)} disabled={isLast} className="hover:text-gray-700 disabled:opacity-30 h-4"><ArrowDown className="w-3 h-3" /></button>
      </div>
      <GripVertical className="w-4 h-4 text-gray-300" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm truncate">{term.label}</div>
        <div className="text-xs font-mono text-gray-400 truncate">{term.key}</div>
      </div>
      <button
        onClick={() => onToggle(!term.is_active)}
        title={term.is_active ? 'Hide from forms' : 'Show on forms'}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${term.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        {term.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      <button onClick={onEdit} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600"><Edit2 className="w-4 h-4" /></button>
      <button onClick={onDelete} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}

function TermModal({ open, type, term, onClose }) {
  const editing = !!term;
  const form = useForm({
    type,
    key: term?.key || '',
    label: term?.label || '',
    is_active: term?.is_active ?? true,
    sort_order: term?.sort_order ?? null,
  });

  React.useEffect(() => {
    if (open) {
      form.setData({
        type,
        key: term?.key || '',
        label: term?.label || '',
        is_active: term?.is_active ?? true,
        sort_order: term?.sort_order ?? null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, term]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const opts = { preserveScroll: true, onSuccess: onClose };
    if (editing) form.put(route('admin.taxonomies.update', term.id), opts);
    else form.post(route('admin.taxonomies.store'), opts);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <form onSubmit={submit} className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">{editing ? 'Edit term' : 'Add term'}</h2>
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
              placeholder="e.g. Single Family Home"
            />
            {form.errors.label && <p className="text-xs text-red-600 mt-1">{form.errors.label}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Key {editing ? '' : <span className="normal-case font-normal text-[10px] text-gray-400">(optional — auto-generated from label if blank)</span>}
            </label>
            <input
              type="text"
              value={form.data.key}
              onChange={(e) => form.setData('key', e.target.value.replace(/[^a-z0-9_-]/gi, '-').toLowerCase())}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
              placeholder="single-family-home"
            />
            <p className="text-[11px] text-gray-500 mt-1">Changing the key after use may orphan existing listings — rename cautiously.</p>
            {form.errors.key && <p className="text-xs text-red-600 mt-1">{form.errors.key}</p>}
          </div>
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

export default function TaxonomiesIndex({ groups = {}, typeMeta = {} }) {
  const types = Object.keys(typeMeta);
  const [tab, setTab] = useState(types[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);

  const openAdd = () => { setEditingTerm(null); setModalOpen(true); };
  const openEdit = (term) => { setEditingTerm(term); setModalOpen(true); };

  const toggleActive = (term, value) => {
    router.put(route('admin.taxonomies.update', term.id), {
      type: term.type,
      label: term.label,
      key: term.key,
      is_active: value,
      sort_order: term.sort_order,
    }, { preserveScroll: true });
  };

  const deleteTerm = (term) => {
    if (!confirm(`Remove "${term.label}"? Existing listings using this value will still show the raw key on their records.`)) return;
    router.delete(route('admin.taxonomies.destroy', term.id), { preserveScroll: true });
  };

  const move = (term, direction) => {
    const list = [...(groups[term.type] || [])];
    const idx = list.findIndex((t) => t.id === term.id);
    if (idx < 0) return;
    const swap = idx + direction;
    if (swap < 0 || swap >= list.length) return;
    [list[idx], list[swap]] = [list[swap], list[idx]];
    const ids = list.map((t) => t.id);
    router.post(route('admin.taxonomies.reorder'), { type: term.type, ids }, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Taxonomies — Admin" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tags className="w-6 h-6 text-[#3355FF]" /> Taxonomies
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage the dropdown options sellers see when listing a property — property types, transaction types, special notices, and listing statuses. Amenities live on their own page.</p>
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:opacity-90">
            <Plus className="w-4 h-4" /> Add {typeMeta[tab]?.singular}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === t ? 'bg-[#1a1816] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              {typeMeta[t].label} <span className="opacity-70">({(groups[t] || []).length})</span>
            </button>
          ))}
        </div>

        {/* Active list */}
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          {(groups[tab] || []).length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              <p className="mb-3">No {typeMeta[tab].label.toLowerCase()} yet.</p>
              <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:opacity-90">
                <Plus className="w-4 h-4" /> Add the first one
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {(groups[tab] || []).map((term, i, arr) => (
                <Row
                  key={term.id}
                  term={term}
                  isFirst={i === 0}
                  isLast={i === arr.length - 1}
                  onEdit={() => openEdit(term)}
                  onDelete={() => deleteTerm(term)}
                  onToggle={(v) => toggleActive(term, v)}
                  onMove={(dir) => move(term, dir)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TermModal
        open={modalOpen}
        type={tab}
        term={editingTerm}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

TaxonomiesIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
