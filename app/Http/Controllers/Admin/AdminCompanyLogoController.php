<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyLogo;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminCompanyLogoController extends Controller
{
    public function index()
    {
        $logos = CompanyLogo::orderBy('sort_order')->get();

        return Inertia::render('Admin/CompanyLogos/Index', [
            'logos' => $logos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'text_logo' => 'nullable|string|max:255',
            'text_color' => 'nullable|string|max:20',
            'text_size' => 'nullable|string|max:20',
            'link_url' => 'nullable|url|max:500',
            'hover_color' => 'nullable|string|max:20',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('company-logos', 'public');
            $validated['image_path'] = '/storage/' . $path;
        }

        unset($validated['image']);

        $logo = CompanyLogo::create($validated);

        ActivityLog::log('company_logo_created', null, null, $validated, "Created company logo: {$logo->name}");

        return redirect()->route('admin.company-logos.index')
            ->with('success', 'Company logo created successfully.');
    }

    public function update(Request $request, CompanyLogo $companyLogo)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'text_logo' => 'nullable|string|max:255',
            'text_color' => 'nullable|string|max:20',
            'text_size' => 'nullable|string|max:20',
            'link_url' => 'nullable|url|max:500',
            'hover_color' => 'nullable|string|max:20',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it was in storage
            if ($companyLogo->image_path && str_starts_with($companyLogo->image_path, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $companyLogo->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('company-logos', 'public');
            $validated['image_path'] = '/storage/' . $path;
        }

        unset($validated['image']);

        $companyLogo->update($validated);

        ActivityLog::log('company_logo_updated', null, null, $validated, "Updated company logo: {$companyLogo->name}");

        return redirect()->route('admin.company-logos.index')
            ->with('success', 'Company logo updated successfully.');
    }

    public function destroy(CompanyLogo $companyLogo)
    {
        $name = $companyLogo->name;

        // Delete image from storage if applicable
        if ($companyLogo->image_path && str_starts_with($companyLogo->image_path, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $companyLogo->image_path);
            Storage::disk('public')->delete($oldPath);
        }

        $companyLogo->delete();

        ActivityLog::log('company_logo_deleted', null, null, ['name' => $name], "Deleted company logo: {$name}");

        return redirect()->route('admin.company-logos.index')
            ->with('success', 'Company logo deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:company_logos,id',
        ]);

        foreach ($request->ids as $index => $id) {
            CompanyLogo::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        CompanyLogo::clearCache();

        return back()->with('success', 'Logo order updated.');
    }
}
