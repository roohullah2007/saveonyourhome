<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\ActivityLog;
use App\Services\OpenAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminResourceController extends Controller
{
    public function __construct(private OpenAiService $openAi) {}

    /**
     * Generate a draft article (title + excerpt + HTML content) from a topic prompt.
     * Returns JSON so the front-end can fill the Resources modal fields.
     */
    public function aiGenerate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topic' => 'required|string|max:500',
            'category' => 'nullable|in:seller,buyer,blog',
            'existing_title' => 'nullable|string|max:255',
        ]);

        if (!$this->openAi->isConfigured()) {
            return response()->json(['error' => 'OpenAI API key is not configured.'], 422);
        }

        $category = $validated['category'] ?? 'blog';
        $audience = match ($category) {
            'seller' => 'home sellers considering For Sale By Owner',
            'buyer' => 'home buyers shopping without a traditional agent',
            default => 'a general real-estate audience',
        };

        $system = 'You are a professional real-estate journalist writing for SaveOnYourHome, a For Sale By Owner marketplace. '
            . 'Write practical, specific, well-structured articles. Never invent statistics or quotes. '
            . 'Return STRICT JSON with keys: title (string, under 90 chars), excerpt (string, under 280 chars), '
            . 'content (HTML string with <h2>/<h3>/<p>/<ul>/<li>/<strong> tags, around 500-800 words, no <html>/<body>, no markdown fences). '
            . 'Do not recommend traditional listing agents or MLS-only approaches.';

        $prompt = "Write an article for {$audience}. Topic: {$validated['topic']}.";
        if (!empty($validated['existing_title'])) {
            $prompt .= "\nUse this headline if it still fits: \"{$validated['existing_title']}\".";
        }
        $prompt .= "\n\nReturn only JSON — no prose outside the JSON, no markdown fences.";

        $raw = $this->openAi->chat([
            ['role' => 'system', 'content' => $system],
            ['role' => 'user', 'content' => $prompt],
        ], [
            'temperature' => 0.7,
            'response_format' => ['type' => 'json_object'],
        ]);

        if (!$raw) {
            $detail = $this->openAi->lastError() ?: 'AI service is unavailable right now. Please try again.';
            return response()->json(['error' => $detail], 502);
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded) || empty($decoded['content'])) {
            return response()->json(['error' => 'AI returned an invalid response. Try a different topic.'], 502);
        }

        return response()->json([
            'title' => trim($decoded['title'] ?? ''),
            'excerpt' => trim($decoded['excerpt'] ?? ''),
            'content' => trim($decoded['content']),
        ]);
    }

    public function index()
    {
        $resources = Resource::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Resources/Index', [
            'resources' => $resources,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'category' => 'required|in:seller,buyer,blog',
            // Featured image is required on create so articles always have a hero.
            // On update it stays optional because the existing image is kept.
            'image' => 'required|image|max:4096',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        // Ensure unique slug
        $originalSlug = $validated['slug'];
        $count = 1;
        while (Resource::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $count++;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('resources', 'public');
            $validated['image'] = '/storage/' . $path;
        } else {
            unset($validated['image']);
        }

        if (!empty($validated['is_published']) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $resource = Resource::create($validated);

        ActivityLog::log('resource_created', null, null, $validated, "Created resource: {$resource->title}");

        return redirect()->route('admin.resources.index')
            ->with('success', 'Resource created successfully.');
    }

    public function update(Request $request, Resource $resource)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'category' => 'required|in:seller,buyer,blog',
            'image' => 'nullable|image|max:4096',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        // Ensure unique slug (excluding current resource)
        $originalSlug = $validated['slug'];
        $count = 1;
        while (Resource::where('slug', $validated['slug'])->where('id', '!=', $resource->id)->exists()) {
            $validated['slug'] = $originalSlug . '-' . $count++;
        }

        if ($request->hasFile('image')) {
            // Delete old image if it was in storage
            if ($resource->image && str_starts_with($resource->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $resource->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('resources', 'public');
            $validated['image'] = '/storage/' . $path;
        } else {
            unset($validated['image']);
        }

        if (!empty($validated['is_published']) && empty($validated['published_at']) && empty($resource->published_at)) {
            $validated['published_at'] = now();
        }

        $resource->update($validated);

        ActivityLog::log('resource_updated', null, null, $validated, "Updated resource: {$resource->title}");

        return redirect()->route('admin.resources.index')
            ->with('success', 'Resource updated successfully.');
    }

    public function destroy(Resource $resource)
    {
        $title = $resource->title;

        // Delete image from storage if applicable
        if ($resource->image && str_starts_with($resource->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $resource->image);
            Storage::disk('public')->delete($oldPath);
        }

        $resource->delete();

        ActivityLog::log('resource_deleted', null, null, ['title' => $title], "Deleted resource: {$title}");

        return redirect()->route('admin.resources.index')
            ->with('success', 'Resource deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'nullable|array',
            'ids.*' => 'integer|exists:resources,id',
            'all' => 'nullable|boolean',
        ]);

        $query = Resource::query();
        if (empty($validated['all'])) {
            if (empty($validated['ids'])) {
                return redirect()->route('admin.resources.index')
                    ->with('error', 'No resources selected.');
            }
            $query->whereIn('id', $validated['ids']);
        }

        $resources = $query->get();
        $count = 0;

        foreach ($resources as $resource) {
            if ($resource->image && str_starts_with($resource->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $resource->image);
                Storage::disk('public')->delete($oldPath);
            }
            $resource->delete();
            $count++;
        }

        ActivityLog::log('resource_bulk_deleted', null, null, ['count' => $count], "Bulk deleted {$count} resource(s)");

        return redirect()->route('admin.resources.index')
            ->with('success', "Deleted {$count} resource(s) successfully.");
    }
}
