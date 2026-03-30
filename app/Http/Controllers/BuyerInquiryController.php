<?php

namespace App\Http\Controllers;

use App\Mail\NewBuyerInquiryToAdmin;
use App\Models\BuyerInquiry;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuyerInquiryController extends Controller
{
    /**
     * Store a new buyer inquiry from the public form
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'preferred_area' => 'required|string|max:255',
            'price_min' => 'required|string|max:50',
            'price_max' => 'required|string|max:50',
            'mls_setup' => 'required|in:yes,no',
            'preapproved' => 'required|in:yes,no',
        ]);

        $inquiry = BuyerInquiry::create($validated);

        // Send notification email to admin
        EmailService::sendToAdmin(new NewBuyerInquiryToAdmin($inquiry));

        return back()->with('success', 'Thank you! We\'ll be in touch soon with property alerts matching your criteria.');
    }

    /**
     * Display all buyer inquiries for admin
     */
    public function index(Request $request)
    {
        $query = BuyerInquiry::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('preferred_area', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->orderBy('created_at', 'desc')->paginate(20);

        // Get counts for status badges
        $counts = [
            'all' => BuyerInquiry::count(),
            'new' => BuyerInquiry::where('status', 'new')->count(),
            'contacted' => BuyerInquiry::where('status', 'contacted')->count(),
            'converted' => BuyerInquiry::where('status', 'converted')->count(),
            'closed' => BuyerInquiry::where('status', 'closed')->count(),
        ];

        return Inertia::render('Admin/BuyerInquiries/Index', [
            'inquiries' => $inquiries,
            'counts' => $counts,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Show a single buyer inquiry
     */
    public function show(BuyerInquiry $inquiry)
    {
        return Inertia::render('Admin/BuyerInquiries/Show', [
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Update buyer inquiry status and notes
     */
    public function update(Request $request, BuyerInquiry $inquiry)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:new,contacted,converted,closed',
            'notes' => 'nullable|string',
        ]);

        $inquiry->update($validated);

        return back()->with('success', 'Inquiry updated successfully.');
    }

    /**
     * Delete a buyer inquiry
     */
    public function destroy(BuyerInquiry $inquiry)
    {
        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Inquiry deleted successfully.');
    }
}
