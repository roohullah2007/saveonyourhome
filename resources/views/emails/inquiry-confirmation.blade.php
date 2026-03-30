@extends('emails.layout')

@section('title', 'Inquiry Sent')
@section('header-title', 'Message Sent')

@section('content')
    <h2>Your Inquiry Has Been Sent!</h2>

    <p>Hello {{ $inquiry->name }},</p>

    <p>Thank you for your interest in this property! Your message has been successfully sent to the seller.</p>

    <div class="highlight">
        <p><strong>The seller will receive your inquiry and contact you directly.</strong></p>
    </div>

    <div class="property-details">
        <h3>Property You Inquired About</h3>
        <table>
            <tr>
                <td>Property</td>
                <td>{{ $property->property_title }}</td>
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
        </table>
    </div>

    <div class="property-details">
        <h3>Your Message</h3>
        <p style="white-space: pre-wrap;">{{ $inquiry->message }}</p>
    </div>

    <div class="property-details">
        <h3>Your Contact Information</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $inquiry->name }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{{ $inquiry->email }}</td>
            </tr>
            @if($inquiry->phone)
            <tr>
                <td>Phone</td>
                <td>{{ $inquiry->phone }}</td>
            </tr>
            @endif
        </table>
    </div>

    <h3>What to Expect</h3>
    <ul>
        <li>The seller typically responds within 24-48 hours</li>
        <li>Check your email (including spam folder) for their reply</li>
        <li>They may also call if you provided a phone number</li>
    </ul>

    <p>
        <a href="{{ $propertyUrl }}" class="btn">View Property Again</a>
    </p>

    <p>Thank you for using OK By Owner to find your next home!</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
