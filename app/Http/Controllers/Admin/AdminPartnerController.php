<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminPartnerController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');

        $query = Partner::query();
        if ($status !== 'all') {
            $query->where('approval_status', $status);
        }

        $partners = $query
            ->orderByRaw("FIELD(approval_status, 'pending', 'approved', 'rejected')")
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners,
            'categories' => Partner::categories(),
            'counts' => [
                'all' => Partner::count(),
                'pending' => Partner::where('approval_status', 'pending')->count(),
                'approved' => Partner::where('approval_status', 'approved')->count(),
                'rejected' => Partner::where('approval_status', 'rejected')->count(),
            ],
            'filters' => ['status' => $status],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePartner($request);
        $validated['slug'] = Partner::generateUniqueSlug($validated['name']);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partner-logos', 'public');
        }

        $validated['approval_status'] = $validated['approval_status'] ?? 'approved';
        if ($validated['approval_status'] === 'approved') {
            $validated['approved_at'] = now();
        }

        Partner::create($validated);

        return redirect()->back()->with('success', 'Partner created successfully.');
    }

    public function update(Request $request, Partner $partner)
    {
        $validated = $this->validatePartner($request);

        if ($request->hasFile('logo')) {
            if ($partner->logo) {
                Storage::disk('public')->delete($partner->logo);
            }
            $validated['logo'] = $request->file('logo')->store('partner-logos', 'public');
        }

        if ($partner->name !== $validated['name']) {
            $validated['slug'] = Partner::generateUniqueSlug($validated['name'], $partner->id);
        }

        $partner->update($validated);

        return redirect()->back()->with('success', 'Partner updated successfully.');
    }

    public function approve(Partner $partner)
    {
        $partner->update([
            'approval_status' => 'approved',
            'is_active' => true,
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        return back()->with('success', 'Partner approved and published.');
    }

    public function reject(Request $request, Partner $partner)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $partner->update([
            'approval_status' => 'rejected',
            'is_active' => false,
            'rejection_reason' => $validated['reason'] ?? null,
        ]);

        return back()->with('success', 'Partner application rejected.');
    }

    public function destroy(Partner $partner)
    {
        if ($partner->logo) {
            Storage::disk('public')->delete($partner->logo);
        }
        $partner->delete();

        return redirect()->back()->with('success', 'Partner deleted successfully.');
    }

    private function validatePartner(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'category' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:500',
            'address' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'services' => 'nullable|array',
            'services.*' => 'string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'approval_status' => 'nullable|in:pending,approved,rejected',
        ]);
    }
}
