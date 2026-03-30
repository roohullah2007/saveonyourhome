@extends('emails.layout')

@section('title', 'New Service Request')
@section('header-title', 'New Service Request')

@section('content')
    <h2>New Service Request Received</h2>

    <p>A new service request has been submitted and requires your attention.</p>

    <div class="highlight">
        <p><strong>Service Type: {{ $serviceRequest->service_type_label }}</strong></p>
    </div>

    <div class="property-details">
        <h3>Customer Information</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $user->name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td><a href="mailto:{{ $user->email ?? '' }}">{{ $user->email ?? 'N/A' }}</a></td>
            </tr>
            @if($user->phone ?? null)
            <tr>
                <td>Phone</td>
                <td><a href="tel:{{ $user->phone }}">{{ $user->phone }}</a></td>
            </tr>
            @endif
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
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }} {{ $property->zip_code }}</td>
            </tr>
            <tr>
                <td>Property Type</td>
                <td>{{ ucfirst($property->property_type) }}</td>
            </tr>
        </table>
    </div>

    <div class="property-details">
        <h3>Request Details</h3>
        <table>
            <tr>
                <td>Service Type</td>
                <td>{{ $serviceRequest->service_type_label }}</td>
            </tr>
            <tr>
                <td>Request Date</td>
                <td>{{ $serviceRequest->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
            @if($serviceRequest->preferred_date)
            <tr>
                <td>Preferred Date</td>
                <td>{{ $serviceRequest->preferred_date->format('F j, Y') }}</td>
            </tr>
            @endif
            @if($serviceRequest->preferred_time)
            <tr>
                <td>Preferred Time</td>
                <td>{{ $serviceRequest->preferred_time }}</td>
            </tr>
            @endif
        </table>
    </div>

    @if($serviceRequest->notes)
    <div class="property-details">
        <h3>Customer Notes</h3>
        <p style="white-space: pre-wrap;">{{ $serviceRequest->notes }}</p>
    </div>
    @endif

    <p>
        <a href="{{ $adminUrl }}" class="btn">View in Admin Panel</a>
    </p>
@endsection
