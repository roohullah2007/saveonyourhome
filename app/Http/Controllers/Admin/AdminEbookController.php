<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Ebook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminEbookController extends Controller
{
    public function index()
    {
        $ebooks = Ebook::query()
            ->orderBy('sort_order')->orderByDesc('id')
            ->withCount('downloads')
            ->get();

        return Inertia::render('Admin/Ebooks/Index', [
            'ebooks' => $ebooks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request, null);

        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('ebook-covers', 'public');
        }

        $file = $request->file('file');
        $filePath = $file->store('ebooks', 'local'); // private disk
        $fileSize = $file->getSize();
        $fileMime = $file->getMimeType();

        $ebook = Ebook::create([
            'title' => $validated['title'],
            'slug' => Ebook::buildUniqueSlug($validated['title']),
            'description' => $validated['description'] ?? null,
            'cover_path' => $coverPath,
            'file_path' => $filePath,
            'file_size' => $fileSize,
            'file_mime' => $fileMime,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? (int) Ebook::max('sort_order') + 10,
            'created_by' => $request->user()->id,
        ]);

        ActivityLog::log('ebook_created', $ebook, null, $ebook->only(['title', 'slug']), "Added ebook: {$ebook->title}");

        return back()->with('success', 'Ebook added.');
    }

    public function update(Request $request, Ebook $ebook)
    {
        $validated = $this->validated($request, $ebook->id);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? $ebook->is_active,
            'sort_order' => $validated['sort_order'] ?? $ebook->sort_order,
        ];

        if ($request->hasFile('cover')) {
            if ($ebook->cover_path) Storage::disk('public')->delete($ebook->cover_path);
            $data['cover_path'] = $request->file('cover')->store('ebook-covers', 'public');
        }

        if ($request->hasFile('file')) {
            $old = $ebook->file_path;
            $file = $request->file('file');
            $data['file_path'] = $file->store('ebooks', 'local');
            $data['file_size'] = $file->getSize();
            $data['file_mime'] = $file->getMimeType();
            if ($old) Storage::disk('local')->delete($old);
        }

        $ebook->update($data);
        ActivityLog::log('ebook_updated', $ebook, null, $data, "Updated ebook: {$ebook->title}");

        return back()->with('success', 'Ebook updated.');
    }

    public function destroy(Ebook $ebook)
    {
        if ($ebook->cover_path) Storage::disk('public')->delete($ebook->cover_path);
        if ($ebook->file_path) Storage::disk('local')->delete($ebook->file_path);

        $title = $ebook->title;
        $ebook->delete();
        ActivityLog::log('ebook_deleted', null, null, ['title' => $title], "Deleted ebook: {$title}");

        return back()->with('success', 'Ebook removed.');
    }

    private function validated(Request $request, ?int $ebookId): array
    {
        $rules = [
            'title' => 'required|string|max:200',
            'description' => 'nullable|string|max:4000',
            'cover' => 'nullable|image|max:4096', // 4 MB
            // PDF / EPUB / MOBI / ZIP — keep it open but cap size.
            'file' => ($ebookId ? 'nullable' : 'required') . '|file|max:51200', // 50 MB
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ];
        return $request->validate($rules);
    }
}
