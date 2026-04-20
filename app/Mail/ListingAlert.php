<?php

namespace App\Mail;

use App\Models\Property;
use App\Models\SavedSearch;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Property $property,
        public SavedSearch $savedSearch,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New match for your saved search: ' . $this->savedSearch->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.listing-alert',
            with: [
                'property' => $this->property,
                'savedSearch' => $this->savedSearch,
                'propertyUrl' => url('/properties/' . $this->property->slug),
                'unsubscribeUrl' => url('/saved-searches/' . $this->savedSearch->id . '/unsubscribe?token=' . $this->savedSearch->user_id . '-' . sha1($this->savedSearch->id . config('app.key'))),
                'dashboardUrl' => url('/dashboard/saved-searches'),
            ],
        );
    }
}
