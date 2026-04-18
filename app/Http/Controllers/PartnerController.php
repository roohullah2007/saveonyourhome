<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function show(string $slug)
    {
        $partner = Partner::where('slug', $slug)->public()->firstOrFail();

        $related = Partner::public()
            ->where('id', '!=', $partner->id)
            ->where('category', $partner->category)
            ->take(3)
            ->get();

        return Inertia::render('PartnerDetail', [
            'partner' => $partner,
            'related' => $related,
        ]);
    }

    public function becomeForm()
    {
        return Inertia::render('BecomePartner', [
            'categories' => Partner::categories(),
        ]);
    }

    public function becomeStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'category' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'required|email|max:255',
            'website' => 'nullable|string|max:500',
            'address' => 'nullable|string|max:500',
            'description' => 'required|string|max:5000',
            'services' => 'nullable|array',
            'services.*' => 'string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('partner-logos', 'public');
        }

        Partner::create([
            'user_id' => $request->user()?->id,
            'name' => $validated['name'],
            'slug' => Partner::generateUniqueSlug($validated['name']),
            'contact_name' => $validated['contact_name'] ?? null,
            'category' => $validated['category'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'],
            'website' => $validated['website'] ?? null,
            'address' => $validated['address'] ?? null,
            'description' => $validated['description'],
            'services' => $validated['services'] ?? [],
            'logo' => $logoPath,
            'is_active' => false,
            'approval_status' => 'pending',
        ]);

        return back()->with('success', 'Thanks! Your partner application has been submitted. Our team will review and contact you within 2 business days.');
    }

    public function inquire(Request $request)
    {
        $validated = $request->validate([
            'partner_id' => 'required|exists:partners,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:5000',
        ]);

        $partner = Partner::where('id', $validated['partner_id'])->public()->firstOrFail();

        // Guard: the UI hides the form when a partner has no email, but enforce on the backend too.
        abort_unless($partner->email, 404, 'This partner does not accept inquiries.');

        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => 'Partner inquiry: ' . $partner->name,
            'message' => sprintf(
                "[Partner Inquiry — %s | %s]\nForwarded to partner email: %s\n\n%s",
                $partner->name,
                $partner->category,
                $partner->email,
                $validated['message']
            ),
            'status' => 'new',
        ]);

        $body = sprintf(
            "You've received a new inquiry from SaveOnYourHome for %s.\n\n" .
            "Name: %s\nEmail: %s\nPhone: %s\n\nMessage:\n%s\n\n— SaveOnYourHome.com",
            $partner->name,
            $validated['name'],
            $validated['email'],
            $validated['phone'] ?? '—',
            $validated['message']
        );

        try {
            Mail::raw($body, function ($m) use ($partner, $validated) {
                $m->to($partner->email)
                    ->subject('New inquiry via SaveOnYourHome')
                    ->replyTo($validated['email'], $validated['name']);
            });
        } catch (\Throwable $e) {
            report($e);
        }

        return back()->with('success', 'Message sent! The partner will be in touch with you shortly.');
    }
}
