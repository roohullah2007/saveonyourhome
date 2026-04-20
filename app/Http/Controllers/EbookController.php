<?php

namespace App\Http\Controllers;

use App\Models\Ebook;
use App\Models\EbookDownload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EbookController extends Controller
{
    /**
     * Public catalog — visible to everyone. Download button itself is
     * gated on authentication (see download()).
     */
    public function index()
    {
        $ebooks = Ebook::query()
            ->active()
            ->orderBy('sort_order')->orderByDesc('id')
            ->get(['id', 'title', 'slug', 'description', 'cover_path', 'file_size', 'file_mime', 'download_count']);

        return Inertia::render('Ebooks', [
            'ebooks' => $ebooks,
        ]);
    }

    /**
     * Auth-gated download. Middleware on the route ensures the caller is
     * logged in; this method logs the download and streams the file.
     */
    public function download(Request $request, Ebook $ebook): StreamedResponse
    {
        abort_unless($ebook->is_active, 404);

        if (!Storage::disk('local')->exists($ebook->file_path)) {
            abort(404, 'File missing on server');
        }

        EbookDownload::create([
            'ebook_id' => $ebook->id,
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 500),
            'created_at' => now(),
        ]);

        $ebook->increment('download_count');

        $filename = $this->downloadFilename($ebook);

        return Storage::disk('local')->download($ebook->file_path, $filename);
    }

    private function downloadFilename(Ebook $ebook): string
    {
        $ext = pathinfo($ebook->file_path, PATHINFO_EXTENSION) ?: 'pdf';
        $safe = \Illuminate\Support\Str::slug($ebook->title) ?: 'ebook';
        return "{$safe}.{$ext}";
    }
}
