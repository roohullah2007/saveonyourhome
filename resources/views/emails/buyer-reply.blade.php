@extends('emails.layout')

@section('title', 'New reply from buyer')
@section('header-title', 'New reply from buyer')

@section('content')
<h2>You've got a new reply</h2>
<p><strong>{{ $buyerName }}</strong> just replied to the conversation about your listing.</p>

<div class="property-details">
    <h3>{{ $property->property_title ?? $property->address }}</h3>
    @if($property->address)
        <p style="margin-top: 4px; color: #6b7280; font-size: 14px;">{{ $property->address }}, {{ $property->city }}, {{ $property->state }}</p>
    @endif
</div>

<div class="highlight">
    <p style="white-space: pre-line;">{{ $replyMessage }}</p>
</div>

<div class="user-info">
    <h4>Buyer contact</h4>
    <p><strong>Name:</strong> {{ $buyerName }}</p>
    @if($buyerEmail)
        <p><strong>Email:</strong> <a href="mailto:{{ $buyerEmail }}">{{ $buyerEmail }}</a></p>
    @endif
</div>

<p style="margin-top: 20px;">
    <a class="btn" href="{{ $messagesUrl }}">Reply in your dashboard</a>
</p>

<p style="margin-top: 20px; font-size: 13px; color: #6b7280;">You can also reply directly to this email — we'll forward it to the buyer.</p>
@endsection
