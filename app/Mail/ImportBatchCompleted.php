<?php

namespace App\Mail;

use App\Models\ImportBatch;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ImportBatchCompleted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ImportBatch $batch
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'CSV Import Complete - ' . $this->batch->imported_count . ' Properties Imported',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.import-batch-completed',
            with: [
                'batch' => $this->batch,
                'batchUrl' => url('/admin/imports/' . $this->batch->id),
            ],
        );
    }
}
