<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10.5pt;
            color: #222;
            line-height: 1.5;
        }
        .page-two {
            padding: 30px 50px;
            page-break-after: always;
        }
        .page-two:last-child {
            page-break-after: auto;
        }
        .page-two-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #999;
        }
        .page-two-header .logo-text {
            font-size: 18pt;
        }
        .page {
            padding: 30px 50px;
            page-break-after: always;
        }
        .header {
            text-align: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #333;
        }
        .logo-text {
            font-size: 26pt;
            font-weight: bold;
            color: #000;
            letter-spacing: 1px;
        }
        .tagline {
            font-size: 9pt;
            color: #555;
            margin-top: 2px;
        }
        .headline {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            color: #000;
            margin: 12px 0;
            line-height: 1.3;
        }
        .date {
            text-align: right;
            margin-bottom: 12px;
            color: #555;
            font-size: 9pt;
        }
        .recipient {
            margin-bottom: 12px;
            line-height: 1.4;
        }
        .greeting {
            margin-bottom: 10px;
        }
        .body-text {
            margin-bottom: 10px;
        }
        .highlight-box {
            border: 2px solid #333;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
            text-align: center;
        }
        .property-address {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 2px;
        }
        .property-price {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 4px;
        }
        .section-heading {
            font-size: 11pt;
            font-weight: bold;
            color: #000;
            margin: 14px 0 6px 0;
        }
        .benefits {
            margin: 8px 0;
            padding-left: 0;
        }
        .benefits li {
            list-style: none;
            padding: 3px 0 3px 20px;
            position: relative;
            font-size: 10.5pt;
        }
        .benefits li::before {
            content: "\2022";
            position: absolute;
            left: 5px;
            font-weight: bold;
            font-size: 12pt;
        }
        .why-section {
            border: 1px solid #999;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
        }
        .why-section h3 {
            color: #000;
            font-size: 11pt;
            margin-bottom: 6px;
        }
        .why-section p {
            font-size: 10pt;
            color: #333;
            line-height: 1.5;
        }
        .claim-section {
            border: 2px solid #333;
            border-radius: 6px;
            padding: 16px;
            margin: 14px 0;
            text-align: center;
        }
        .claim-section h3 {
            color: #000;
            font-size: 13pt;
            margin-bottom: 8px;
        }
        .claim-section p {
            font-size: 10.5pt;
            margin-bottom: 6px;
        }
        .qr-code {
            margin: 8px 0;
        }
        .qr-code img {
            width: 160px;
            height: 160px;
        }
        .claim-url {
            font-family: monospace;
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            margin-top: 6px;
        }
        .free-section {
            border: 1px solid #999;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
        }
        .free-section h3 {
            font-size: 11pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 6px;
        }
        .free-section p {
            font-size: 10pt;
            margin-bottom: 4px;
        }
        .optional-section {
            margin: 12px 0;
        }
        .optional-section h3 {
            font-size: 10pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 4px;
        }
        .optional-section p,
        .optional-section li {
            font-size: 9.5pt;
            color: #444;
        }
        .optional-section ul {
            margin: 4px 0;
            padding-left: 0;
        }
        .optional-section li {
            list-style: none;
            padding: 2px 0 2px 18px;
            position: relative;
        }
        .optional-section li::before {
            content: "\2022";
            position: absolute;
            left: 5px;
        }
        .signature {
            margin-top: 16px;
            line-height: 1.4;
        }
        .ps-note {
            margin-top: 12px;
            font-size: 10pt;
            font-style: italic;
            color: #333;
        }
        .contact-info {
            text-align: center;
            margin-top: 10px;
            font-size: 8.5pt;
            color: #666;
        }
    </style>
</head>
<body>
@foreach($letters as $letter)
    <div class="page">
        <div class="header">
            <div class="logo-text">SaveOnYourHome</div>
            <div class="tagline">Serving For Sale By Owner Homeowners Since 1997</div>
        </div>

        <div class="headline">
            Your Home Is Already Listed on SaveOnYourHome &mdash; Claim It for Free
        </div>

        <div class="date">{{ $letter['date'] }}</div>

        @if($letter['property']->owner_name)
        <div class="recipient">
            <strong>{{ $letter['property']->owner_name }}</strong><br>
            @if($letter['property']->owner_mailing_address)
            {{ $letter['property']->owner_mailing_address }}<br>
            @endif
        </div>
        @endif

        <div class="greeting">
            Dear {{ $letter['property']->owner_name ?? 'Homeowner' }},
        </div>

        <div class="body-text">
            Your home at <strong>{{ $letter['property']->address }}</strong> has already been added to SaveOnYourHome.com
            and is now ready to be visible to buyers searching for homes in your area.
            All you need to do is claim your listing.
        </div>

        <div class="body-text">
            SaveOnYourHome has been helping For Sale By Owner homeowners advertise their properties since 1997.
            Your listing is currently unclaimed. Claiming it is free and takes less than 60 seconds.
        </div>

        <div class="section-heading">Why claim your free SaveOnYourHome listing?</div>
        <div class="body-text">
            Most buyers search multiple websites &mdash; not just Zillow. Claiming your SaveOnYourHome listing
            helps make sure buyers can find your home and contact you directly.
        </div>
        <div class="body-text">When you claim your listing, you can:</div>

        <ul class="benefits">
            <li>Increase your exposure to additional buyers</li>
            <li>Receive buyer inquiries directly to you</li>
            <li>Share your personal listing link on social media</li>
            <li>Add open house dates and listing updates anytime</li>
            <li>Request a free QR code sticker for your yard sign so drive-by buyers can instantly view your listing</li>
            <li>Access free printable flyers and marketing tools</li>
            <li>Maintain full control of your sale</li>
        </ul>

        <div class="body-text">
            More exposure and direct buyer contact give you the best opportunity to sell your home.
        </div>

        <div class="highlight-box">
            <div style="font-size: 10pt; font-weight: bold; margin-bottom: 4px;">Your Listing Is Ready to Claim:</div>
            <div class="property-address">{{ $letter['property']->address }}</div>
            <div>{{ $letter['property']->city }}, {{ $letter['property']->state }} {{ $letter['property']->zip_code }}</div>
            @if($letter['property']->price > 0)
            <div class="property-price">${{ number_format($letter['property']->price, 0) }}</div>
            @endif
        </div>

        <div class="body-text" style="margin-top: 12px;">
            Claim your free listing today and make sure interested buyers can contact you directly.
            See the next page to claim your listing in less than 60 seconds.
        </div>

        <div class="signature">
            <p>Sincerely,</p>
            <p style="margin-top: 4px;"><strong>SaveOnYourHome</strong></p>
            <p style="font-size: 9.5pt; color: #555;">Serving For Sale By Owner homeowners since 1997</p>
        </div>
    </div>

    {{-- Page 2: QR Code & Claim Section --}}
    <div class="page-two">
        <div class="page-two-header">
            <div class="logo-text">SaveOnYourHome</div>
            <div class="tagline">Serving For Sale By Owner Homeowners Since 1997</div>
        </div>

        <div class="claim-section">
            <h3>Claim Your Listing Now</h3>
            <p>Scan the QR code or visit the link below:</p>
            <div class="qr-code">
                <img src="{{ $letter['qrCodeBase64'] }}" alt="QR Code">
            </div>
            <div style="font-size: 10pt; color: #555; margin-top: 4px;">or visit:</div>
            <div class="claim-url">{{ $letter['shortClaimUrl'] }}</div>
        </div>

        <div class="free-section">
            <h3>Completely Free. No Contract. No Obligation.</h3>
            <p>Your SaveOnYourHome listing is completely free to claim and use. There is:</p>
            <p><strong>No commission. No contract. No obligation.</strong></p>
            <p>SaveOnYourHome is simply a free platform designed to help homeowners advertise their property and connect directly with buyers.</p>
        </div>

        <div class="optional-section">
            <h3>Optional Marketing Enhancements (Available If You Ever Want Them)</h3>
            <p>Some homeowners choose to add additional marketing services for even greater exposure, including:</p>
            <ul>
                <li>Local MLS listing for broader distribution</li>
                <li>Professional photography</li>
                <li>Drone photos and video</li>
                <li>Floor plans</li>
                <li>3D virtual tours</li>
            </ul>
            <p>These services are optional. Your SaveOnYourHome listing remains free whether you use them or not.</p>
        </div>

        <div class="ps-note">
            P.S. Once claimed, you can also request your free QR code yard sign sticker to help capture interest from drive-by buyers.
        </div>

        <div class="contact-info">
            SaveOnYourHome.com &bull; info@saveonyourhome.com
        </div>
    </div>
@endforeach
</body>
</html>
