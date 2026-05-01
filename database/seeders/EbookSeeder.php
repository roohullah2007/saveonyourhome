<?php

namespace Database\Seeders;

use App\Models\Ebook;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Seeds a handful of sample ebooks backed by a single placeholder PDF.
 * Run with:  php artisan db:seed --class=EbookSeeder
 */
class EbookSeeder extends Seeder
{
    public function run(): void
    {
        $sharedPath = $this->ensurePlaceholderPdf();

        $samples = [
            [
                'title' => 'The For Sale By Owner Playbook',
                'description' => "The complete walkthrough for selling your home without an agent — pricing, photos, listing copy, negotiation, and closing.",
                'file_size' => 1_482_752,
                'download_count' => 1284,
                'sort_order' => 1,
            ],
            [
                'title' => 'First-Time Home Buyer Survival Guide',
                'description' => "From pre-approval to closing day. Avoid the 12 mistakes most first-time buyers make and walk into the deal with confidence.",
                'file_size' => 982_016,
                'download_count' => 873,
                'sort_order' => 2,
            ],
            [
                'title' => 'Pricing Your Home Right',
                'description' => "Why \"price it high and negotiate down\" is a myth. A practical guide to comp analysis, market positioning, and adjusting on the fly.",
                'file_size' => 654_000,
                'download_count' => 421,
                'sort_order' => 3,
            ],
            [
                'title' => 'FSBO Photography Cheat Sheet',
                'description' => "Take listing photos that look like a $500 pro shoot — using just your phone. Lighting, angles, and the 8-room shot list.",
                'file_size' => 2_310_500,
                'download_count' => 612,
                'sort_order' => 4,
            ],
            [
                'title' => 'Negotiating the Counter-Offer',
                'description' => "Scripts and tactics for handling lowball offers, repair-credit requests, and competing buyers — without losing the deal.",
                'file_size' => 489_300,
                'download_count' => 297,
                'sort_order' => 5,
            ],
            [
                'title' => 'Closing Day Checklist',
                'description' => "A simple checklist that walks you through every document, every signature, and every line on the settlement statement.",
                'file_size' => 312_900,
                'download_count' => 158,
                'sort_order' => 6,
            ],
        ];

        foreach ($samples as $data) {
            Ebook::updateOrCreate(
                ['slug' => Ebook::buildUniqueSlug($data['title'])],
                array_merge($data, [
                    'file_path' => $sharedPath,
                    'file_mime' => 'application/pdf',
                    'is_active' => true,
                    'cover_path' => null, // shows the BookOpen icon placeholder
                ])
            );
        }

        $this->command?->info('Seeded ' . count($samples) . ' sample ebooks. Visit /ebooks to preview.');
    }

    /**
     * Make sure a tiny valid PDF exists on the local (private) disk so download
     * routes resolve. We share one file across every seeded ebook — fine for a
     * design preview; real ebooks each get their own upload via the admin UI.
     */
    private function ensurePlaceholderPdf(): string
    {
        $relative = 'ebooks/sample-placeholder.pdf';
        $disk = Storage::disk('local');

        if (!$disk->exists($relative)) {
            $disk->put($relative, $this->minimalPdf());
        }

        return $relative;
    }

    private function minimalPdf(): string
    {
        // Hand-rolled minimal PDF (~250 bytes). Renders as a single blank page
        // in any PDF viewer — enough to satisfy the download flow.
        return "%PDF-1.4\n"
            . "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            . "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
            . "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >> endobj\n"
            . "xref\n"
            . "0 4\n"
            . "0000000000 65535 f \n"
            . "0000000009 00000 n \n"
            . "0000000056 00000 n \n"
            . "0000000110 00000 n \n"
            . "trailer << /Size 4 /Root 1 0 R >>\n"
            . "startxref\n"
            . "175\n"
            . "%%EOF\n";
    }
}
