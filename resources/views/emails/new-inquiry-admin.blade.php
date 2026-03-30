@extends('emails.layout')

@section('title', 'New Property Inquiry')
@section('header-title', 'New Inquiry')

@section('content')
    <h2>New Property Inquiry Received</h2>

    <p>A potential buyer has submitted an inquiry about a property listing.</p>

    <div class="property-details">
        <h3>Inquirer Information</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $inquiry->name }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td><a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a></td>
            </tr>
            @if($inquiry->phone)
            <tr>
                <td>Phone</td>
                <td><a href="tel:{{ $inquiry->phone }}">{{ $inquiry->phone }}</a></td>
            </tr>
            @endif
            <tr>
                <td>Inquiry Date</td>
                <td>{{ $inquiry->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
        </table>
    </div>

    <div class="property-details">
        <h3>Property Details</h3>
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
                <td>Seller Contact</td>
                <td>{{ $property->contact_name }} ({{ $property->contact_email }})</td>
            </tr>
        </table>
    </div>

    <div class="property-details">
        <h3>Inquiry Message</h3>
        <p style="white-space: pre-wrap;">{{ $inquiry->message }}</p>
    </div>

    <p>
        <a href="{{ $propertyUrl }}" class="btn" style="margin-right: 10px;">View Property</a>
        <a href="{{ $adminUrl }}" class="btn" style="background-color: #6b7280;">View in Admin</a>
    </p>

    <p><em>Note: The property seller has also been notified of this inquiry.</em></p>
@endsection
