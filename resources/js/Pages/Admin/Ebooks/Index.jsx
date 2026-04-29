import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, X, Check, FileText, Download, Loader2 } from 'lucide-react';

function humanSize(bytes) {
  const n = Number(bytes) || 0;
  if (n <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = n, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return (i === 0 ? Math.round(v) : v.toFixed(1)) + ' ' + units[i];
}

function EbookModal({ open, ebook, onClose }) {
  const editing = !!ebook;
  const form = useForm({
    title: ebook?.title || '',
    description: ebook?.description || '',
    cover: null,
    file: null,
    // Use 1/0 so Laravel's `boolean` validator accepts the FormData-serialized value
    // (multipart forms stringify "true"/"false" which the validator rejects).
    is_active: (ebook?.is_active ?? true) ? 1 : 0,
  });

  React.useEffect(() => {
    if (!open) return;
    form.setData({
      title: ebook?.title || '',
      description: ebook?.description || '',
      cover: null,
      file: null,
      is_active: (ebook?.is_active ?? true) ? 1 : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ebook]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const opts = {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: onClose,
    };
    if (editing) {
      form.post(route('admin.ebooks.update', ebook.id), opts);
    } else {
      form.post(route('admin.ebooks.store'), opts);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <form onSubmit={submit} className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">{editing ? 'Edit eBook' : 'Add eBook'}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
            <input
              required
              type="text"
              value={form.data.title}
              onChange={(e) => form.setData('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
              placeholder="e.g. The FSBO Pricing Playbook"
            />
            {form.errors.title && <p className="text-xs text-red-600 mt-1">{form.errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
              placeholder="Short summary shown on the public eBooks page."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Cover image <span className="normal-case font-normal text-[10px] text-gray-400">(optional · JPG/PNG · up to 4 MB)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => form.setData('cover', e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold hover:file:bg-gray-200"
            />
            {editing && ebook.cover_url && !form.data.cover && (
              <div className="mt-2 flex items-center gap-2">
                <img src={ebook.cover_url} alt="cover" className="w-14 h-20 object-cover rounded border border-gray-200" />
                <span className="text-xs text-gray-500">Current cover — upload a new file to replace.</span>
              </div>
            )}
            {form.errors.cover && <p className="text-xs text-red-600 mt-1">{form.errors.cover}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              File {editing ? <span className="normal-case font-normal text-[10px] text-gray-400">(upload a new file to replace)</span> : <span className="text-red-500">*</span>}
              <span className="normal-case font-normal text-[10px] text-gray-400"> · PDF / EPUB / ZIP · up to 50 MB</span>
            </label>
            <input
              type="file"
              accept=".pdf,.epub,.mobi,.zip,application/pdf,application/epub+zip,application/x-mobipocket-ebook,application/zip"
              onChange={(e) => form.setData('file', e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold hover:file:bg-gray-200"
            />
            {editing && ebook.file_size && (
              <p className="text-xs text-gray-500 mt-1.5">Current: {humanSize(ebook.file_size)}</p>
            )}
            {form.errors.file && <p className="text-xs text-red-600 mt-1">{form.errors.file}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked ? 1 : 0)} />
            <span>Active (visible on public page)</span>
          </label>

          {form.progress && (
            <div className="rounded-lg bg-blue-50 text-blue-800 px-3 py-2 text-xs">
              Uploading… {form.progress.percentage}%
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={form.processing} className="px-4 py-2 bg-[#3355FF] text-white rounded-lg disabled:opacity-50 inline-flex items-center gap-2 font-semibold">
            {form.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} {form.processing ? 'Saving…' : (editing ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EbooksIndex({ ebooks = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (ebook) => { setEditing(ebook); setModalOpen(true); };

  const toggleActive = (ebook) => {
    const fd = new FormData();
    fd.append('title', ebook.title);
    fd.append('description', ebook.description || '');
    fd.append('is_active', ebook.is_active ? '0' : '1');
    router.post(route('admin.ebooks.update', ebook.id), fd, { preserveScroll: true });
  };

  const destroy = (ebook) => {
    if (!confirm(`Delete "${ebook.title}"? This cannot be undone.`)) return;
    router.delete(route('admin.ebooks.destroy', ebook.id), { preserveScroll: true });
  };

  return (
    <>
      <Head title="eBooks — Admin" />
      <div>
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#3355FF]" /> eBooks
            </h1>
            <p className="text-gray-500 text-sm mt-1">Upload free guides for users to download. Visitors must be signed in to download &mdash; every download is logged on the Analytics page.</p>
          </div>
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:opacity-90 font-semibold">
            <Plus className="w-4 h-4" /> Add eBook
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Cover</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Downloads</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ebooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      No eBooks yet. Click <button onClick={openAdd} className="text-[#3355FF] font-semibold hover:underline">Add eBook</button> to upload your first.
                    </td>
                  </tr>
                ) : ebooks.map((eb) => (
                  <tr key={eb.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {eb.cover_url ? (
                        <img src={eb.cover_url} alt="" className="w-12 h-16 object-cover rounded border border-gray-200" />
                      ) : (
                        <div className="w-12 h-16 rounded border border-gray-200 bg-gray-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 line-clamp-2">{eb.title}</div>
                      <div className="text-xs font-mono text-gray-400 mt-0.5">{eb.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-gray-400" /> {humanSize(eb.file_size)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1.5 text-gray-700">
                        <Download className="w-4 h-4 text-gray-400" /> {eb.download_count?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(eb)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${eb.is_active ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {eb.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {eb.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(eb)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => destroy(eb)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EbookModal open={modalOpen} ebook={editing} onClose={() => setModalOpen(false)} />
    </>
  );
}

EbooksIndex.layout = (page) => <AdminLayout title="eBooks">{page}</AdminLayout>;
