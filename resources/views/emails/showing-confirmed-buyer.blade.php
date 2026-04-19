@extends('emails.layout')

@section('title', 'Your viewing is confirmed')
@section('header-title', 'Your viewing is confirmed')

@section('content')
<h2>Hi {{ $showing->buyer_name }},</h2>
<p>Thanks for booking a {{ strtolower($typeLabel) }} with SaveOnYourHome. A calendar invite is attached so you can add it to your calendar in one click.</p>

<div class="property-details">
    <h3>Viewing details</h3>
    <table>
        <tr><td>Property</td><td>{{ $propertyTitle }}</td></tr>
        @if($propertyAddress)
            <tr><td>Address</td><td>{{ $propertyAddress }}</td></tr>
        @endif
        <tr><td>When</td><td>{{ $when }}</td></tr>
        <tr><td>Duration</td><td>{{ $showing->duration_minutes }} minutes</td></tr>
        <tr><td>Type</td><td>{{ $typeLabel }}</td></tr>
        @if($showing->seller?->name)
            <tr><td>Seller</td><td>{{ $showing->seller->name }}</td></tr>
        @endif
    </table>
</div>

@if($showing->meeting_type === 'phone')
<div class="highlight"><p>The seller will call you at <strong>{{ $showing->buyer_phone ?: 'the number you provided' }}</strong> at the scheduled time.</p></div>
@else
<div class="highlight"><p>Please arrive 5 minutes early and bring a photo ID. The seller will greet you at the property.</p></div>
@endif

<p>Need to cancel? Use the link below:</p>
<p><a class="btn btn-secondary" href="{{ $cancelUrl }}">Cancel this viewing</a></p>
<p style="margin-top: 20px; font-size: 13px; color: #6b7280;">Questions? Just reply to this email.</p>
@endsection
