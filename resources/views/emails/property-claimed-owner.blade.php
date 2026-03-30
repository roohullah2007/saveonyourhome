@extends('emails.layout')

@section('header-title', 'Your Listing is Live!')

@section('content')
    <h2>Congratulations, {{ $owner->name }}!</h2>

    <p>Your property listing is now live on SaveOnYourHome and visible to Oklahoma home buyers.</p>

    <div class="property-details">
        <h3>Your Property</h3>
        <table>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }} {{ $property->zip_code }}</td>
            </tr>
            <tr>
                <td>Price</td>
                <td>${{ number_format($property->price, 0) }}</td>
            </tr>
        </table>
    </div>

    <div class="highlight">
        <p><strong>Next steps:</strong> Add photos to your listing to attract more buyers! Properties with photos get 5x more views.</p>
    </div>

    <p>From your dashboard you can:</p>
    <ul>
        <li>Add photos and update your listing details</li>
        <li>View and respond to buyer inquiries</li>
        <li>Order FREE QR code stickers</li>
        <li>Schedule open houses</li>
    </ul>

    <a href="{{ $dashboardUrl }}" class="btn">Go to My Dashboard</a>
    <a href="{{ $propertyUrl }}" class="btn btn-secondary">View My Listing</a>

    <p style="margin-top: 20px;">Thank you for choosing SaveOnYourHome — Oklahoma's #1 For Sale By Owner platform.</p>
@endsection
