@extends('emails.layout')

@section('title', 'Reply About Your Inquiry')
@section('header-title', 'Seller Reply')

@section('content')
    <h2>The Seller Has Replied!</h2>

    <p>Hello {{ $inquiry->name }},</p>

    <p>Great news! The seller of <strong>{{ $property->address }}, {{ $property->city }}</strong> has responded to your inquiry.</p>

    <div class="property-details">
        <h3>Property: {{ $property->property_title }}</h3>
        <table>
            <tr>
                <td>Price</td>
                <td>${{ number_format($property->price) }}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }}</td>
            </tr>
        </table>
    </div>

    <div class="highlight">
        <p><strong>Your Original Message:</strong></p>
        <p style="white-space: pre-wrap; color: #666;">{{ $inquiry->message }}</p>
    </div>

    <div class="highlight" style="background-color: #e8f5e9; border-left: 4px solid #4caf50;">
        <p><strong>Reply from {{ $sellerName }}:</strong></p>
        <p style="white-space: pre-wrap;">{{ $replyMessage }}</p>
    </div>

    <p>
        <a href="{{ $propertyUrl }}" class="btn">View Listing</a>
    </p>

    <p style="color: #888; font-size: 13px;">
        This message was sent through SaveOnYourHome.com's secure messaging system. The seller's contact details are shared only if they choose to reveal them.
    </p>

    <p>
        <strong>The SaveOnYourHome Team</strong>
    </p>
@endsection
