@extends('emails.layout')

@section('title', 'Property Listing Requires Attention')
@section('header-title', 'Action Required')

@section('content')
    <h2>Your Property Listing Requires Attention</h2>

    <p>Hello {{ $property->contact_name }},</p>

    <p>Thank you for submitting your property listing to OK By Owner. After reviewing your submission, we found some issues that need to be addressed before we can approve your listing.</p>

    <div class="property-details">
        <h3>{{ $property->property_title }}</h3>
        <table>
            <tr>
                <td>Property Type</td>
                <td>{{ ucfirst($property->property_type) }}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }} {{ $property->zip_code }}</td>
            </tr>
        </table>
    </div>

    <div class="highlight" style="background-color: #fef2f2; border-left-color: #dc2626;">
        <h4 style="color: #dc2626; margin-top: 0;">Reason for Review:</h4>
        <p style="margin-bottom: 0;">{{ $rejectionReason }}</p>
    </div>

    <h3>What You Can Do</h3>
    <ol>
        <li>Review the feedback provided above</li>
        <li>Log in to your dashboard and edit your listing</li>
        <li>Make the necessary corrections</li>
        <li>Save your changes - your listing will be resubmitted for review</li>
    </ol>

    <p>
        <a href="{{ $dashboardUrl }}" class="btn">Edit Your Listing</a>
    </p>

    <p>If you have questions about the feedback or need assistance, please don't hesitate to contact us.</p>

    <p>
        <a href="{{ $contactUrl }}" class="btn" style="background-color: #6b7280;">Contact Support</a>
    </p>

    <p>We're here to help you get your property listed successfully!</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
