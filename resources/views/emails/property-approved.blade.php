@extends('emails.layout')

@section('title', 'Property Approved')
@section('header-title', 'Great News!')

@section('content')
    <h2>Your Property Has Been Approved!</h2>

    <p>Hello {{ $property->contact_name }},</p>

    <p>We're pleased to inform you that your property listing has been reviewed and approved. Your listing is now live and visible to potential buyers on OK By Owner!</p>

    <div class="highlight">
        <p><strong>Your property is now active and ready to receive inquiries!</strong></p>
    </div>

    <div class="property-details">
        <h3>{{ $property->property_title }}</h3>
        <table>
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
                <td>{{ $property->full_bathrooms ?? $property->bathrooms }}{{ $property->half_bathrooms ? ' full, ' . $property->half_bathrooms . ' half' : '' }}</td>
            </tr>
            @if($property->sqft)
            <tr>
                <td>Square Feet</td>
                <td>{{ number_format($property->sqft) }} sq ft</td>
            </tr>
            @endif
        </table>
    </div>

    <p>
        <a href="{{ $propertyUrl }}" class="btn">View Your Listing</a>
    </p>

    <h3>Maximize Your Listing's Potential</h3>
    <ul>
        <li>Share your listing on social media to reach more buyers</li>
        <li>Respond quickly to inquiries - fast responses lead to faster sales</li>
        <li>Keep your listing photos and description up to date</li>
        <li>Consider our premium upgrade services for more visibility</li>
    </ul>

    <p>You can manage your listing anytime from your dashboard.</p>

    <p>
        <a href="{{ $dashboardUrl }}" class="btn" style="background-color: #6b7280;">Go to Dashboard</a>
    </p>

    <p>Thank you for choosing OK By Owner. We wish you success with your sale!</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
