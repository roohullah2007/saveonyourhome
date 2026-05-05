@extends('emails.layout')

@section('title', 'Yard sign ordered')
@section('header-title', 'Yard Sign Ordered')

@section('content')
    <h2>A yard sign was ordered for your listing</h2>

    <p>Hello {{ $property->contact_name ?: optional($property->user)->name ?: 'there' }},</p>

    @if ($byAdmin)
        <p>Our team just placed a yard sign order on your behalf for the listing below. The sign will ship from our partner with a QR code that scans straight to your listing page.</p>
    @else
        <p>This is a confirmation that a yard sign order was just opened for the listing below. The QR code on the sign points to your listing page so anyone driving by can scan it on their phone.</p>
    @endif

    <div class="property-details">
        <h3>{{ $property->property_title }}</h3>
        <table>
            <tr>
                <td>Address</td>
                <td>{{ trim(implode(', ', array_filter([$property->address, $property->city, $property->state, $property->zip_code]))) }}</td>
            </tr>
            <tr>
                <td>Listing</td>
                <td><a href="{{ $listingUrl }}">{{ $listingUrl }}</a></td>
            </tr>
        </table>
    </div>

    <p>If you didn't expect this email, just ignore it — placing the order doesn't change anything on your listing. Questions? Reply to this email.</p>

    <p>Thanks,<br>The SaveOnYourHome team</p>
@endsection
