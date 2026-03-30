<?php

namespace App\Mail;

use App\Models\Property;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyClaimedToOwner extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Property $property,
        public User $owner
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Property is Live on SaveOnYourHome!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.property-claimed-owner',
            with: [
                'property' => $this->property,
                'owner' => $this->owner,
                'propertyUrl' => url('/properties/' . $this->property->slug),
                'dashboardUrl' => url('/dashboard/listings'),
            ],
        );
    }
}
