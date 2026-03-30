<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormConfirmation;
use App\Mail\NewContactMessageToAdmin;
use App\Models\ContactMessage;
use App\Services\EmailService;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'sms_consent' => 'nullable|boolean',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'sms_consent' => $request->boolean('sms_consent'),
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        // Send confirmation to user and notification to admin (with delay between)
        EmailService::sendToUserAndAdmin(
            $contactMessage->email,
            new ContactFormConfirmation($contactMessage),
            new NewContactMessageToAdmin($contactMessage)
        );

        return redirect()->back()->with('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
    }
}
