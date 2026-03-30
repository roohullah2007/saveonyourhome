@extends('emails.layout')

@section('title', 'New Buyer Inquiry')
@section('header-title', 'New Buyer Lead')

@section('content')
    <h2>New Buyer Inquiry Received</h2>

    <p>A new potential buyer has submitted an inquiry through the website.</p>

    <div class="property-details">
        <h3>Buyer Information</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $inquiry->name }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td><a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a></td>
            </tr>
            @if($inquiry->phone)
            <tr>
                <td>Phone</td>
                <td><a href="tel:{{ $inquiry->phone }}">{{ $inquiry->phone }}</a></td>
            </tr>
            @endif
            <tr>
                <td>Submitted</td>
                <td>{{ $inquiry->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
        </table>
    </div>

    <div class="user-info">
        <h4>Property Preferences</h4>
        <p><strong>Preferred Area:</strong> {{ $inquiry->preferred_area }}</p>
        <p><strong>Price Range:</strong> ${{ $inquiry->price_min }} - ${{ $inquiry->price_max }}</p>
        <p><strong>MLS Setup:</strong> {{ $inquiry->mls_setup === 'yes' ? 'Yes, interested' : 'No, not interested' }}</p>
        <p><strong>Pre-approved:</strong> {{ $inquiry->preapproved === 'yes' ? 'Yes' : 'No' }}</p>
    </div>

    <p>
        <a href="mailto:{{ $inquiry->email }}?subject=Your Inquiry at OK By Owner" class="btn">Reply via Email</a>
        @if($inquiry->phone)
        <a href="tel:{{ $inquiry->phone }}" class="btn btn-secondary">Call Buyer</a>
        @endif
    </p>

    <p>
        <a href="{{ $adminUrl }}" class="btn btn-secondary">View All Buyer Inquiries</a>
    </p>

    <p>
        <strong>OK By Owner Admin System</strong>
    </p>
@endsection
