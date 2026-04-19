@extends('emails.layout')

@section('title', 'You have a new message')
@section('header-title', 'You have a new message')

@section('content')
<h2>Hi {{ $inquiry->name }},</h2>

<p><strong>{{ $sellerName }}</strong> just replied about <strong>{{ $property->property_title ?? $property->address }}</strong>. Their message is below.</p>

<div class="highlight" style="background-color:#e8f5e9;border-left:4px solid #4caf50;">
    <p style="white-space:pre-wrap;margin:0;">{{ $replyMessage }}</p>
</div>

<div class="property-details">
    <h3>{{ $property->property_title ?? $property->address }}</h3>
    <table>
        <tr><td>Address</td><td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }}</td></tr>
        <tr><td>Price</td><td>${{ number_format($property->price) }}</td></tr>
    </table>
</div>

@if($isRegistered)
    <p style="margin-top:20px;">
        <a class="btn" href="{{ $messagesUrl }}">Open conversation &amp; reply</a>
    </p>
    <p style="font-size:13px;color:#6b7280;">Sign in with <strong>{{ $inquiry->email }}</strong> to see the full thread and reply from your dashboard.</p>
@else
    <div class="user-info">
        <h4>Want to reply?</h4>
        <p style="margin:0 0 10px 0;">Create a free SaveOnYourHome account with this email (<strong>{{ $inquiry->email }}</strong>) and you'll find this conversation waiting in your dashboard.</p>
    </div>
    <p style="margin-top:20px;">
        <a class="btn" href="{{ $registerUrl }}">Create free account &amp; reply</a>
        <a class="btn btn-secondary" href="{{ $loginUrl }}">I already have an account</a>
    </p>
    <p style="font-size:13px;color:#6b7280;">Or reply directly to this email — we'll forward it to the seller.</p>
@endif

<div class="highlight">
    <p style="margin:0;"><strong>Your original message:</strong></p>
    <p style="white-space:pre-wrap;color:#666;margin:5px 0 0 0;">{{ $inquiry->message }}</p>
</div>

<p style="color:#888;font-size:12px;margin-top:24px;">
    Sent through SaveOnYourHome's secure messaging. The seller's private contact details stay hidden unless they choose to share them.
</p>
@endsection
