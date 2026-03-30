@extends('emails.layout')

@section('title', 'New Property Inquiry')
@section('header-title', 'New Inquiry')

@section('content')
    <h2>You Have a New Inquiry!</h2>

    <p>Hello {{ $property->contact_name }},</p>

    <p>Great news! Someone is interested in your property listing. Here are the details:</p>

    <div class="property-details">
        <h3>Property: {{ $property->property_title }}</h3>
        <table>
            <tr>
                <td>Price</td>
                <td>${{ number_format($property->price) }}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}</td>
            </tr>
        </table>
    </div>

    <div class="user-info">
        <h4>Inquiry From:</h4>
        <p><strong>Name:</strong> {{ $inquiry->name }}</p>
        <p><strong>Email:</strong> <a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a></p>
        @if($inquiry->phone)
        <p><strong>Phone:</strong> <a href="tel:{{ $inquiry->phone }}">{{ $inquiry->phone }}</a></p>
        @endif
        <p><strong>Received:</strong> {{ $inquiry->created_at->format('F j, Y \a\t g:i A') }}</p>
    </div>

    <div class="highlight">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">{{ $inquiry->message }}</p>
    </div>

    <h3>Quick Actions</h3>
    <p>
        <a href="mailto:{{ $inquiry->email }}?subject=Re: {{ $property->property_title }}" class="btn">Reply via Email</a>
        @if($inquiry->phone)
        <a href="tel:{{ $inquiry->phone }}" class="btn btn-secondary">Call Now</a>
        @endif
    </p>

    <p>
        <a href="{{ $dashboardUrl }}" class="btn btn-secondary">View All Messages</a>
        <a href="{{ $propertyUrl }}" class="btn btn-secondary">View Your Listing</a>
    </p>

    <h3>Tips for Responding</h3>
    <ul>
        <li>Respond within 24 hours for the best results</li>
        <li>Be friendly and helpful</li>
        <li>Offer to schedule a showing at their convenience</li>
        <li>Have key information about your property ready</li>
    </ul>

    <p>Good luck with your sale!</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
