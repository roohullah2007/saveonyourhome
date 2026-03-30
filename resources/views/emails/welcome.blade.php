@extends('emails.layout')

@section('title', 'Welcome to OK By Owner')
@section('header-title', 'Welcome!')

@section('content')
    <h2>Welcome to OK By Owner!</h2>

    <p>Hello {{ $user->name }},</p>

    <p>Thank you for creating an account with OK By Owner - Oklahoma's premier For Sale By Owner marketplace!</p>

    <div class="highlight">
        <p><strong>Your account is now active and ready to use.</strong></p>
    </div>

    <h3>Account Details</h3>
    <div class="property-details">
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $user->name }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{{ $user->email }}</td>
            </tr>
            <tr>
                <td>Account Type</td>
                <td>{{ ucfirst($user->role) }}</td>
            </tr>
            <tr>
                <td>Member Since</td>
                <td>{{ $user->created_at->format('F j, Y') }}</td>
            </tr>
        </table>
    </div>

    @if($user->role === 'seller')
    <h3>Ready to List Your Property?</h3>
    <p>As a seller, you can now list your property for free and reach thousands of potential buyers in Oklahoma.</p>
    <p>
        <a href="{{ $listPropertyUrl }}" class="btn">List Your Property</a>
    </p>
    @elseif($user->role === 'buyer')
    <h3>Start Your Property Search</h3>
    <p>Browse our extensive listings to find your dream home in Oklahoma.</p>
    <p>
        <a href="{{ $propertiesUrl }}" class="btn">Browse Properties</a>
    </p>
    @endif

    <h3>What You Can Do</h3>
    <ul>
        @if($user->role === 'seller')
        <li>List your property for free</li>
        <li>Manage your listings from your dashboard</li>
        <li>Respond to inquiries from potential buyers</li>
        <li>Upgrade to premium packages for more visibility</li>
        @elseif($user->role === 'buyer')
        <li>Browse all available properties</li>
        <li>Save your favorite listings</li>
        <li>Contact property owners directly</li>
        <li>Request property showings</li>
        @else
        <li>Browse properties</li>
        <li>Save favorites</li>
        <li>Contact property owners</li>
        @endif
    </ul>

    <p>
        <a href="{{ $dashboardUrl }}" class="btn">Go to Dashboard</a>
    </p>

    <p>If you have any questions, feel free to reach out to our support team.</p>

    <p>Welcome aboard!</p>

    <p>
        <strong>The OK By Owner Team</strong>
    </p>
@endsection
