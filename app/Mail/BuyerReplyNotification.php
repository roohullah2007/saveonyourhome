<?php

namespace App\Mail;

use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BuyerReplyNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Inquiry $inquiry,
        public Property $property,
        public string $replyMessage,
        public string $buyerName,
        public ?string $buyerEmail = null,
    ) {}

    public function envelope(): Envelope
    {
        $replyTo = $this->buyerEmail ?: $this->inquiry->email;

        return new Envelope(
            subject: 'New reply from ' . $this->buyerName . ' about ' . ($this->property->address ?? $this->property->property_title),
            replyTo: $replyTo ? [$replyTo] : [],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.buyer-reply',
            with: [
                'inquiry' => $this->inquiry,
                'property' => $this->property,
                'replyMessage' => $this->replyMessage,
                'buyerName' => $this->buyerName,
                'buyerEmail' => $this->buyerEmail,
                'messagesUrl' => url('/dashboard/messages'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
