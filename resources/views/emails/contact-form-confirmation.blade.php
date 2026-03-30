@extends('emails.layout')

@section('title', 'Message Received')
@section('header-title', 'Thank You!')

@section('content')
    <h2>We've Received Your Message</h2>

    <p>Hello {{ $contactMessage->name }},</p>

    <p>Thank you for reaching out to OK By Owner! We've received your message and our team will review it shortly.</p>

    <div class="highlight">
        <p><strong>We typically respond within 24 hours during business days.</strong></p>
    </div>

    <div class="property-details">
        <h3>Your Message Details</h3>
        <table>
            <tr>
                <td>Subject</td>
                <td>{{ $contactMessage->subject }}</td>
            </tr>
            <tr>
                <td>Submitted On</td>
                <td>{{ $contactMessage->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
        </table>
    </div>

    <div class="property-details">
        <h3>Your Message</h3>
        <p style="white-space: pre-wrap;">{{ $contactMessage->message }}</p>
    </div>

    <h3>While You Wait</h3>
    <ul>
        <li>Browse our latest property listings</li>
        <li>Check out our seller resources</li>
        <li>Learn more about listing your property for free</li>
    </ul>

    <p>
        <a href="{{ $propertiesUrl }}" class="btn">Browse Properties</a>
    </p>

    <p>If your matter is urgent, please note that our team prioritizes messages in the order they're received.</p>

    <p>Thank you for choosing OK By Owner!</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
