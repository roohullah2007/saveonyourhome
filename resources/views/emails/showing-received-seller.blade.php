@extends('emails.layout')

@section('title', 'New viewing booked')
@section('header-title', 'New viewing booked')

@section('content')
<h2>You've got a new {{ strtolower($typeLabel) }} request</h2>
<p>A buyer just booked a viewing on your listing. The calendar invite is attached.</p>

<div class="property-details">
    <h3>Booking details</h3>
    <table>
        <tr><td>Property</td><td>{{ $propertyTitle }}</td></tr>
        <tr><td>When</td><td>{{ $when }}</td></tr>
        <tr><td>Duration</td><td>{{ $showing->duration_minutes }} minutes</td></tr>
        <tr><td>Type</td><td>{{ $typeLabel }}</td></tr>
    </table>
</div>

<div class="user-info">
    <h4>Buyer details</h4>
    <p><strong>Name:</strong> {{ $showing->buyer_name }}</p>
    <p><strong>Email:</strong> <a href="mailto:{{ $showing->buyer_email }}">{{ $showing->buyer_email }}</a></p>
    @if($showing->buyer_phone)
        <p><strong>Phone:</strong> <a href="tel:{{ $showing->buyer_phone }}">{{ $showing->buyer_phone }}</a></p>
    @endif
    @if($showing->buyer_notes)
        <p><strong>Notes:</strong><br>{{ $showing->buyer_notes }}</p>
    @endif
</div>

<p><a class="btn" href="{{ url('/dashboard/showings') }}">View all your showings</a></p>
<p style="margin-top: 20px; font-size: 13px; color: #6b7280;">Need to cancel or reschedule? Manage this showing from your dashboard.</p>
@endsection
