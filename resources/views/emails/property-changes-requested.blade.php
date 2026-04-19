@extends('emails.layout')

@section('title', 'Changes requested')
@section('header-title', 'Changes requested')

@section('content')
<h2>Hi {{ $property->contact_name }},</h2>
<p>Our admin team reviewed your listing for <strong>{{ $property->property_title }}</strong> and asked for a few changes before it can go live.</p>

<div class="highlight">
    <p><strong>What they wrote:</strong></p>
    <p style="white-space: pre-line;">{{ $feedback }}</p>
</div>

<p>Log in to your dashboard, update the listing, and hit <strong>Publish for review</strong> again to resubmit. Once you do, the admin will take another look.</p>

<p style="margin-top: 20px;">
    <a class="btn" href="{{ url('/dashboard/listings') }}">Open my listings</a>
</p>

<p style="margin-top: 30px; font-size: 13px; color: #6b7280;">Questions? Just reply to this email.</p>
@endsection
