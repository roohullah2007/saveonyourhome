<?php

namespace App\Mail;

use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SellerReplyNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Inquiry $inquiry,
        public Property $property,
        public string $replyMessage,
        public string $sellerName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reply from seller about ' . ($this->property->address ?? $this->property->property_title),
            replyTo: [$this->property->contact_email],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.seller-reply',
            with: [
                'inquiry' => $this->inquiry,
                'property' => $this->property,
                'replyMessage' => $this->replyMessage,
                'sellerName' => $this->sellerName,
                'propertyUrl' => url('/properties/' . $this->property->id),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
