@extends('emails.layout')

@section('title', 'New Contact Message')
@section('header-title', 'Contact Form')

@section('content')
    <h2>New Contact Message Received</h2>

    <p>A visitor has submitted a message through the contact form.</p>

    <div class="property-details">
        <h3>Contact Information</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $contactMessage->name }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td><a href="mailto:{{ $contactMessage->email }}">{{ $contactMessage->email }}</a></td>
            </tr>
            @if($contactMessage->phone)
            <tr>
                <td>Phone</td>
                <td><a href="tel:{{ $contactMessage->phone }}">{{ $contactMessage->phone }}</a></td>
            </tr>
            @endif
            <tr>
                <td>Subject</td>
                <td>{{ $contactMessage->subject }}</td>
            </tr>
            <tr>
                <td>Submitted</td>
                <td>{{ $contactMessage->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
        </table>
    </div>

    <div class="highlight">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">{{ $contactMessage->message }}</p>
    </div>

    <p>
        <a href="mailto:{{ $contactMessage->email }}?subject=Re: {{ $contactMessage->subject }}" class="btn">Reply via Email</a>
        @if($contactMessage->phone)
        <a href="tel:{{ $contactMessage->phone }}" class="btn btn-secondary">Call</a>
        @endif
    </p>

    <p>
        <a href="{{ $adminUrl }}" class="btn btn-secondary">View All Contact Messages</a>
    </p>

    <p>
        <strong>OK By Owner Admin System</strong>
    </p>
@endsection
