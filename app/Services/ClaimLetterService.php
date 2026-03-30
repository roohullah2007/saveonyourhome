<?php

namespace App\Services;

use App\Models\ImportBatch;
use App\Models\Property;
use Barryvdh\DomPDF\Facade\Pdf;
use chillerlan\QRCode\{QRCode, QROptions};

class ClaimLetterService
{
    /**
     * Generate a single claim letter PDF.
     */
    public function generateLetter(Property $property)
    {
        $qrCodeBase64 = $this->generateQrCode($property);

        $data = [
            'property' => $property,
            'claimUrl' => url('/claim/' . $property->claim_token),
            'shortClaimUrl' => 'SaveOnYourHome.com/claim/' . $property->id,
            'qrCodeBase64' => $qrCodeBase64,
            'expiresAt' => $property->claim_expires_at?->format('F j, Y'),
            'date' => now()->format('F j, Y'),
        ];

        $pdf = Pdf::loadView('pdf.claim-letter', $data);
        $pdf->setPaper('letter');

        return $pdf;
    }

    /**
     * Generate batch letters PDF (one letter per page).
     */
    public function generateBatchLetters(ImportBatch $batch)
    {
        $properties = $batch->properties()
            ->whereNull('claimed_at')
            ->whereNotNull('owner_name')
            ->get();

        $letters = [];
        foreach ($properties as $property) {
            $letters[] = [
                'property' => $property,
                'claimUrl' => url('/claim/' . $property->claim_token),
                'shortClaimUrl' => 'SaveOnYourHome.com/claim/' . $property->id,
                'qrCodeBase64' => $this->generateQrCode($property),
                'expiresAt' => $property->claim_expires_at?->format('F j, Y'),
                'date' => now()->format('F j, Y'),
            ];
        }

        $pdf = Pdf::loadView('pdf.claim-letter-batch', ['letters' => $letters]);
        $pdf->setPaper('letter');

        return $pdf;
    }

    /**
     * Generate QR code as base64 PNG.
     */
    protected function generateQrCode(Property $property): string
    {
        $url = url('/claim/' . $property->claim_token);

        $options = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel' => QRCode::ECC_M,
            'scale' => 8,
            'imageBase64' => true,
        ]);

        $qrcode = new QRCode($options);
        return $qrcode->render($url);
    }
}
