@extends('emails.layout')

@section('title', 'New User Registration')
@section('header-title', 'New User')

@section('content')
    <h2>New User Registration</h2>

    <p>A new user has registered on OK By Owner.</p>

    <div class="property-details">
        <h3>User Details</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $user->name }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td><a href="mailto:{{ $user->email }}">{{ $user->email }}</a></td>
            </tr>
            <tr>
                <td>Role</td>
                <td>{{ ucfirst($user->role ?? 'user') }}</td>
            </tr>
            <tr>
                <td>Registered At</td>
                <td>{{ $user->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
            <tr>
                <td>Email Verified</td>
                <td>{{ $user->email_verified_at ? 'Yes' : 'Pending' }}</td>
            </tr>
        </table>
    </div>

    <p>
        <a href="{{ $adminUrl }}" class="btn">View in Admin Panel</a>
    </p>
@endsection
