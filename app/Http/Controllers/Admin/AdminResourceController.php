<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminResourceController extends Controller
{
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
}
