@extends('emails.layout')

@section('header-title', 'Property Claimed!')

@section('content')
    <h2>An imported property has been claimed</h2>

    <p>Good news! A homeowner has claimed their imported listing on SaveOnYourHome.</p>

    <div class="property-details">
        <h3>Property Details</h3>
        <table>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }} {{ $property->zip_code }}</td>
            </tr>
            <tr>
                <td>Price</td>
                <td>${{ number_format($property->price, 0) }}</td>
            </tr>
            <tr>
                <td>Import Source</td>
                <td>{{ ucfirst($property->import_source) }}</td>
            </tr>
        </table>
    </div>

    <div class="user-info">
        <h4>Claimed By</h4>
        <p><strong>Name:</strong> {{ $claimedBy->name }}</p>
        <p><strong>Email:</strong> {{ $claimedBy->email }}</p>
        <p><strong>Claimed At:</strong> {{ $property->claimed_at->format('F j, Y \a\t g:i A') }}</p>
    </div>

    <p>The property is now live and visible to buyers.</p>

    <a href="{{ $adminUrl }}" class="btn">View in Admin</a>
    <a href="{{ $propertyUrl }}" class="btn btn-secondary">View Listing</a>
@endsection
