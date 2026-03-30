@extends('emails.layout')

@section('title', 'Service Request Received')
@section('header-title', 'Request Confirmed')

@section('content')
    <h2>We've Received Your Service Request</h2>

    <p>Hello {{ $serviceRequest->user->name ?? 'Valued Customer' }},</p>

    <p>Thank you for your service request! We've received your submission and our team will review it shortly.</p>

    <div class="highlight">
        <p><strong>Service Requested: {{ $serviceRequest->service_type_label }}</strong></p>
    </div>

    <div class="property-details">
        <h3>Request Details</h3>
        <table>
            <tr>
                <td>Service Type</td>
                <td>{{ $serviceRequest->service_type_label }}</td>
            </tr>
            <tr>
                <td>Property</td>
                <td>{{ $property->property_title }}</td>
            </tr>
            <tr>
                <td>Property Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }}</td>
            </tr>
            <tr>
                <td>Request Date</td>
                <td>{{ $serviceRequest->created_at->format('F j, Y') }}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td>{{ $serviceRequest->status_label }}</td>
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
        <h3>Additional Notes</h3>
        <p>{{ $serviceRequest->notes }}</p>
    </div>
    @endif

    <h3>What Happens Next?</h3>
    <ul>
        <li>Our team will review your request within 1-2 business days</li>
        <li>We'll contact you to confirm details and scheduling</li>
        <li>You can track your request status in your dashboard</li>
    </ul>

    <p>
        <a href="{{ $dashboardUrl }}" class="btn">View Request Status</a>
    </p>

    <p>If you have any questions, feel free to contact us.</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
