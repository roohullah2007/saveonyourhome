<?php

namespace App\Mail;

use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PropertyChangesRequested extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Property $property, public string $feedback)
    {
    }

    public function build()
    {
        return $this
            ->subject('Changes requested for your listing')
            ->view('emails.property-changes-requested', [
                'property' => $this->property,
                'feedback' => $this->feedback,
            ]);
    }
}
