<?php

namespace App\Mail;

use App\Models\Property;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyClaimedToAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Property $property,
        public User $claimedBy
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Property Claimed - ' . $this->property->address,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.property-claimed-admin',
            with: [
                'property' => $this->property,
                'claimedBy' => $this->claimedBy,
                'adminUrl' => url('/admin/properties/' . $this->property->id),
                'propertyUrl' => url('/properties/' . $this->property->slug),
            ],
        );
    }
}
