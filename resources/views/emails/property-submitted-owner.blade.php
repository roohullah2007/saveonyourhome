@extends('emails.layout')

@section('title', 'Your Property Listing is Now Live')
@section('header-title', 'Listing Confirmation')

@section('content')
    <h2>Congratulations! Your Property is Now Live</h2>

    <p>Hello {{ $property->contact_name }},</p>

    <p>Great news! Your property listing has been successfully submitted and is now live on OK By Owner.</p>

    <div class="highlight">
        <p><strong>Your listing is immediately visible to potential buyers!</strong></p>
    </div>

    <div class="property-details">
        <h3>{{ $property->property_title }}</h3>
        <table>
            <tr>
                <td>Submission Date</td>
                <td>{{ $submissionDate }}</td>
            </tr>
            <tr>
                <td>Property Type</td>
                <td>{{ ucfirst($property->property_type) }}</td>
            </tr>
            <tr>
                <td>Price</td>
                <td>${{ number_format($property->price) }}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }} {{ $property->zip_code }}</td>
            </tr>
            <tr>
                <td>Bedrooms</td>
                <td>{{ $property->bedrooms }}</td>
            </tr>
            <tr>
                <td>Bathrooms</td>
                <td>{{ $property->bathrooms }}</td>
            </tr>
            <tr>
                <td>Square Feet</td>
                <td>{{ number_format($property->sqft) }} sq ft</td>
            </tr>
        </table>
    </div>

    <p>
        <a href="{{ $propertyUrl }}" class="btn">View Your Listing</a>
    </p>

    <h3>What's Next?</h3>
    <ul>
        <li>Share your listing link with friends and family</li>
        <li>Keep your listing updated with accurate information</li>
        <li>Respond promptly to inquiries from potential buyers</li>
        <li>Consider upgrading to a premium package for more visibility</li>
    </ul>

    <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>

    <p>Best of luck with your sale!</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
