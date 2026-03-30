@extends('emails.layout')

@section('title', 'New Property Listing Submitted')
@section('header-title', 'New Listing Alert')

@section('content')
    <h2>New Property Listing Submitted</h2>

    <p>A new property listing has been submitted and is now live on the site.</p>

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
            <tr>
                <td>Status</td>
                <td>{{ ucfirst(str_replace('-', ' ', $property->status)) }}</td>
            </tr>
        </table>
    </div>

    @if($user)
    <div class="user-info">
        <h4>Submitted By (Registered User)</h4>
        <p><strong>Name:</strong> {{ $user->name }}</p>
        <p><strong>Email:</strong> {{ $user->email }}</p>
        <p><strong>Account Type:</strong> {{ ucfirst($user->role) }}</p>
    </div>
    @else
    <div class="user-info">
        <h4>Contact Information (Guest Submission)</h4>
        <p><strong>Name:</strong> {{ $property->contact_name }}</p>
        <p><strong>Email:</strong> {{ $property->contact_email }}</p>
        <p><strong>Phone:</strong> {{ $property->contact_phone }}</p>
    </div>
    @endif

    <p>
        <a href="{{ $propertyUrl }}" class="btn">View Public Listing</a>
        <a href="{{ $adminUrl }}" class="btn btn-secondary">View in Admin Panel</a>
    </p>

    <h3>Property Description</h3>
    <p>{{ Str::limit($property->description, 500) }}</p>

    @if($property->features && count($property->features) > 0)
    <h3>Features</h3>
    <ul>
        @foreach(array_slice($property->features, 0, 10) as $feature)
            <li>{{ $feature }}</li>
        @endforeach
        @if(count($property->features) > 10)
            <li><em>...and {{ count($property->features) - 10 }} more</em></li>
        @endif
    </ul>
    @endif

    <p>
        <strong>OK By Owner Admin System</strong>
    </p>
@endsection
