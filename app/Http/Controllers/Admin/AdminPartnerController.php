<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPartnerController extends Controller
{
    public function index()
    {
        $partners = Partner::orderBy('category')->orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners,
            'categories' => Partner::categories(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:500',
            'address' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        Partner::create($validated);

        return redirect()->back()->with('success', 'Partner created successfully.');
    }

    public function update(Request $request, Partner $partner)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:500',
            'address' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $partner->update($validated);

        return redirect()->back()->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();

        return redirect()->back()->with('success', 'Partner deleted successfully.');
    }
}
