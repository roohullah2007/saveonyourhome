import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Database, AlertTriangle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function WordpressImportIndex({ available, summary, recentBatches, connection, flash, errors }) {
    const { data, setData, post, processing } = useForm({
        users: true,
        taxonomies: true,
        listings: true,
        posts: true,
        download_images: true,
        limit: '',
        notes: '',
    });

    const [confirmOpen, setConfirmOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!confirmOpen) { setConfirmOpen(true); return; }
        post(route('admin.wordpress-import.run'), { preserveScroll: true });
    };

    const Counter = ({ label, value }) => (
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">{(value ?? 0).toLocaleString()}</div>
        </div>
    );

    const Toggle = ({ field, title, description }) => (
        <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
                type="checkbox"
                checked={!!data[field]}
                onChange={(e) => setData(field, e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
            />
            <div>
                <div className="font-medium text-gray-900">{title}</div>
                <div className="text-sm text-gray-500 mt-0.5">{description}</div>
            </div>
        </label>
    );

    return (
        <AdminLayout title="Import WordPress">
            <Head title="Import WordPress" />

            <div className="max-w-4xl">
                <div className="mb-6">
                    <p className="text-gray-600">
                        Import users, listings, taxonomies, and blog posts from the legacy WordPress
                        (Houzez) site. Re-runs are safe — every record is matched on its WordPress ID
                        and updated in place rather than duplicated.
                    </p>
                </div>

                {/* Connection + dump summary */}
                <section className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                    <div className="flex items-start gap-3">
                        <Database className={`w-6 h-6 ${available ? 'text-green-600' : 'text-amber-600'} flex-shrink-0`} />
                        <div className="flex-1">
                            <h2 className="font-semibold text-gray-900">Legacy DB Connection</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {connection.host} → <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{connection.database}</code>
                            </p>
                            {!available && (
                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold">Legacy DB not reachable.</div>
                                            <div className="mt-1">Load the WordPress dump into MySQL first:</div>
                                            <pre className="mt-2 bg-amber-100 px-2 py-1.5 rounded text-xs overflow-x-auto">
mysql -u root -e "CREATE DATABASE IF NOT EXISTS {connection.database}"
mysql -u root {connection.database} &lt; saveonyourhomeold.sql
                                            </pre>
                                            <div className="mt-2">Then verify <code>WP_LEGACY_DB_*</code> in <code>.env</code>.</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {available && summary && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <Counter label="Users" value={summary.users} />
                                    <Counter label="Properties" value={summary.properties} />
                                    <Counter label="Posts (blog)" value={summary.posts} />
                                    <Counter label="Attachments" value={summary.attachments} />
                                    <Counter label="Agents" value={summary.agents} />
                                    <Counter label="Taxonomies" value={summary.taxonomies} />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Errors / flash */}
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-green-900">{flash.success}</div>
                    </div>
                )}
                {Object.values(errors || {}).length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm text-red-900">
                            {Object.values(errors).map((e, i) => <div key={i}>{e}</div>)}
                        </div>
                    </div>
                )}

                {/* Run form */}
                <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                    <h2 className="font-semibold text-gray-900 mb-3">What to import</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Toggle field="users" title="Users"
                            description="wp_users + wp_usermeta → users (with role mapping)" />
                        <Toggle field="taxonomies" title="Taxonomies"
                            description="property_type / property_status / property_label → taxonomy_terms" />
                        <Toggle field="listings" title="Listings (Properties)"
                            description="post_type=property + Houzez fave_* meta → properties" />
                        <Toggle field="posts" title="Blog posts"
                            description="post_type=post → resources" />
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={!!data.download_images}
                                onChange={(e) => setData('download_images', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
                                disabled={!data.listings}
                            />
                            <div>
                                <div className="font-medium text-gray-900">Download &amp; convert images</div>
                                <div className="text-sm text-gray-500 mt-0.5">Queues one job per image. Streams from the original URL, resizes to 1920px, encodes to WebP at q=85.</div>
                            </div>
                        </label>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property limit (optional)</label>
                            <input
                                type="number"
                                min="1"
                                value={data.limit}
                                onChange={(e) => setData('limit', e.target.value)}
                                placeholder="e.g. 5 for a test run"
                                className="w-full rounded-md border-gray-300 focus:border-[#1A1816] focus:ring-[#1A1816] text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            className="w-full rounded-md border-gray-300 focus:border-[#1A1816] focus:ring-[#1A1816] text-sm"
                            placeholder="What's this import for?"
                        />
                    </div>

                    {confirmOpen && (
                        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <div className="font-semibold text-amber-900">Confirm import</div>
                                    <div className="text-amber-800 mt-1">
                                        This runs synchronously and may take ~30 seconds for 170 listings (image downloads run on the queue
                                        afterwards). Re-runs are idempotent.
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing || !available}
                                            className="px-4 py-2 bg-[#1A1816] text-white text-sm font-medium rounded-md hover:bg-black disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                            {processing ? 'Importing…' : 'Yes, run import'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmOpen(false)}
                                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!confirmOpen && (
                        <div className="mt-5">
                            <button
                                type="submit"
                                disabled={!available || (!data.users && !data.taxonomies && !data.listings && !data.posts)}
                                className="px-4 py-2 bg-[#1A1816] text-white text-sm font-medium rounded-md hover:bg-black disabled:opacity-50"
                            >
                                Run import…
                            </button>
                            <span className="ml-3 text-xs text-gray-500">
                                Or from CLI: <code className="bg-gray-100 px-1.5 py-0.5 rounded">php artisan wp:import --all</code>
                            </span>
                        </div>
                    )}
                </form>

                {/* Recent batches */}
                {recentBatches?.length > 0 && (
                    <section className="bg-white rounded-lg border border-gray-200 p-5">
                        <h2 className="font-semibold text-gray-900 mb-3">Recent WordPress import batches</h2>
                        <div className="divide-y divide-gray-100">
                            {recentBatches.map((b) => (
                                <Link
                                    key={b.id}
                                    href={route('admin.imports.show', b.id)}
                                    className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">Batch #{b.id}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {b.imported_count} imported, {b.failed_count} failed · {new Date(b.created_at).toLocaleString()}
                                            {b.notes && ` · ${b.notes}`}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AdminLayout>
    );
}
