<?php

namespace App\Http\Controllers;

use App\Mail\InquiryConfirmation;
use App\Mail\NewInquiryNotification;
use App\Models\Inquiry;
use App\Models\Property;
use App\Services\EmailService;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Store a newly created property inquiry.
     */
    public function store(Request $request)
    {
        // Honeypot spam check - if the hidden field has a value, it's a bot
        if ($request->filled('website')) {
            return redirect()->back()->with('success', 'Your message has been sent!');
        }

        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:1000',
        ]);

        $property = Property::findOrFail($validated['property_id']);

        $inquiry = Inquiry::create([
            'property_id' => $validated['property_id'],
            'user_id' => auth()->check() ? auth()->id() : null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'type' => 'general',
            'status' => 'new',
        ]);

        // Property-detail inquiries route to the seller, not to admin.
        if (EmailService::isEnabled()) {
            EmailService::sendToUser($inquiry->email, new InquiryConfirmation($inquiry, $property));

            sleep(2);
            if ($property->contact_email) {
                EmailService::sendToUser($property->contact_email, new NewInquiryNotification($inquiry, $property));
            }
        }

        return redirect()->back()->with('success', 'Your message has been sent! The seller will contact you soon.');
    }
}
