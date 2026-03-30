@extends('emails.layout')

@section('title', 'Your Property Listing Has Been Updated')
@section('header-title', 'Listing Updated')

@section('content')
    <h2>Your Property Listing Has Been Updated</h2>

    <p>Hello {{ $property->contact_name }},</p>

    <p>This email confirms that your property listing has been successfully updated.</p>

    <div class="property-details">
        <h3>{{ $property->property_title }}</h3>
        <table>
            <tr>
                <td>Last Updated</td>
                <td>{{ $updateDate }}</td>
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
            <tr>
                <td>Status</td>
                <td>{{ $property->is_active ? 'Active' : 'Inactive' }}</td>
            </tr>
        </table>
    </div>

    <p>
        <a href="{{ $propertyUrl }}" class="btn">View Your Listing</a>
    </p>

    <p>If you did not make this update or have any concerns, please contact us immediately.</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
