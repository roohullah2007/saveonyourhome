<?php

namespace App\Mail;

use App\Models\Property;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class YardSignOrderedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Property $property,
        public ?User $orderedBy = null,
        public bool $byAdmin = false,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Yard sign ordered for ' . ($this->property->property_title ?: 'your listing'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.yard-sign-ordered',
            with: [
                'property' => $this->property,
                'orderedBy' => $this->orderedBy,
                'byAdmin' => $this->byAdmin,
                'listingUrl' => url('/properties/' . ($this->property->slug ?: $this->property->id)),
            ],
        );
    }
}
