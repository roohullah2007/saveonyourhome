<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\QrSticker;
use App\Models\QrScan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Typography\FontFactory;
use chillerlan\QRCode\QRCode as ChillerlanQRCode;
use chillerlan\QRCode\QROptions;

class QrCodeController extends Controller
{
    /**
     * Generate and download a print-ready 4x4 inch PNG sticker (1200x1200px at 300 DPI)
     * Design: Mini "FOR SALE BY OWNER" sign with QR code
     */
    public function generate(Property $property)
    {
        // Get or create the QR sticker for this property
        $sticker = $property->qrSticker;

        if (!$sticker) {
            $sticker = QrSticker::create([
                'property_id' => $property->id,
                'short_code' => QrSticker::generateShortCode(),
            ]);
        }

        // Build the short URL
        $url = url('/p/' . $sticker->short_code);

        // Generate QR code as PNG using chillerlan (works with GD, no imagick needed)
        $options = new QROptions([
            'outputType' => ChillerlanQRCode::OUTPUT_IMAGE_PNG,
            'scale' => 20,
            'outputBase64' => false,
            'eccLevel' => ChillerlanQRCode::ECC_H,
            'imageTransparent' => false,
            'quietzoneSize' => 1,
        ]);

        $qrGenerator = new ChillerlanQRCode($options);
        $qrPngData = $qrGenerator->render($url);

        // Create a 1200x1200 canvas with red background (4 inches at 300 DPI)
        $canvas = Image::create(1200, 1200)->fill('#CC0000');

        $fontPath = $this->getFontPath();

        // Add "FOR SALE" text at top
        if ($fontPath) {
            $canvas->text('FOR SALE', 600, 120, function (FontFactory $font) use ($fontPath) {
                $font->filename($fontPath);
                $font->size(120);
                $font->color('#ffffff');
                $font->align('center');
                $font->valign('middle');
            });

            // Add "BY OWNER" text below
            $canvas->text('BY OWNER', 600, 240, function (FontFactory $font) use ($fontPath) {
                $font->filename($fontPath);
                $font->size(80);
                $font->color('#ffffff');
                $font->align('center');
                $font->valign('middle');
            });
        }

        // Draw white rectangle for QR code area (with padding)
        $canvas->drawRectangle(100, 300, function ($draw) {
            $draw->size(1000, 750);
            $draw->background('#ffffff');
        });

        // Load and resize QR code
        $qrImage = Image::read($qrPngData);
        $qrImage->resize(650, 650);

        // Place QR code in the white area (centered)
        $canvas->place($qrImage, 'top-center', 0, 350);

        // Add "Scan to View Listing" text at the bottom (on red)
        if ($fontPath) {
            $canvas->text('SCAN TO VIEW LISTING', 600, 1120, function (FontFactory $font) use ($fontPath) {
                $font->filename($fontPath);
                $font->size(50);
                $font->color('#ffffff');
                $font->align('center');
                $font->valign('middle');
            });
        }

        // Encode as PNG
        $pngData = $canvas->toPng();

        // Create filename
        $filename = 'qr-sticker-' . $sticker->short_code . '.png';

        return response($pngData)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    /**
     * Generate a preview QR code (smaller, for display in dashboard)
     */
    public function preview(Property $property)
    {
        // Get or create the QR sticker
        $sticker = $property->qrSticker;

        if (!$sticker) {
            $sticker = QrSticker::create([
                'property_id' => $property->id,
                'short_code' => QrSticker::generateShortCode(),
            ]);
        }

        // Build the short URL
        $url = url('/p/' . $sticker->short_code);

        // Generate QR code as SVG for preview (lighter weight for web display)
        $qrCode = QrCode::format('svg')
            ->size(300)
            ->errorCorrection('H')
            ->margin(1)
            ->generate($url);

        return response($qrCode)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Handle QR code scan redirect
     */
    public function handleScan(Request $request, string $code)
    {
        $sticker = QrSticker::where('short_code', $code)->first();

        if (!$sticker) {
            abort(404, 'QR code not found');
        }

        // Record the scan
        $sticker->recordScan();

        // Log detailed scan info
        QrScan::create([
            'property_id' => $sticker->property_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referer' => $request->header('referer'),
            'scanned_at' => now(),
        ]);

        // Redirect to the property page with slug URL (SEO friendly)
        return redirect()->to('/properties/' . $sticker->property->slug);
    }

    /**
     * Get sticker info for a property (API endpoint)
     */
    public function getStickerInfo(Property $property)
    {
        $sticker = $property->qrSticker;

        if (!$sticker) {
            return response()->json([
                'has_sticker' => false,
            ]);
        }

        return response()->json([
            'has_sticker' => true,
            'short_code' => $sticker->short_code,
            'short_url' => $sticker->short_url,
            'scan_count' => $sticker->scan_count,
            'last_scanned_at' => $sticker->last_scanned_at?->diffForHumans(),
        ]);
    }

    /**
     * Get a valid font path for text rendering
     */
    private function getFontPath(): ?string
    {
        // Check for custom font in public/fonts
        $customFont = public_path('fonts/arial.ttf');
        if (file_exists($customFont)) {
            return $customFont;
        }

        // Try Windows system fonts
        $windowsFonts = [
            'C:/Windows/Fonts/arial.ttf',
            'C:/Windows/Fonts/Arial.ttf',
            'C:/Windows/Fonts/segoeui.ttf',
            'C:/Windows/Fonts/calibri.ttf',
        ];

        foreach ($windowsFonts as $font) {
            if (file_exists($font)) {
                return $font;
            }
        }

        // Try Linux/Mac system fonts
        $unixFonts = [
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/TTF/DejaVuSans.ttf',
            '/Library/Fonts/Arial.ttf',
        ];

        foreach ($unixFonts as $font) {
            if (file_exists($font)) {
                return $font;
            }
        }

        return null;
    }
}
