@extends('emails.layout')

@section('title', 'Verify Your Email')
@section('header-title', 'Email Verification')

@section('content')
    <h2>Verify Your Email Address</h2>

    <p>Hello {{ $user->name }},</p>

    <p>Thank you for signing up with Save On Your Home! Please use the verification code below to complete your registration.</p>

    <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #f5f5f5; border: 2px dashed #0891B2; border-radius: 12px; padding: 25px; display: inline-block;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Verification Code:</p>
            <p style="margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0891B2;">{{ $code }}</p>
        </div>
    </div>

    <div class="highlight">
        <p><strong>This code will expire in 15 minutes.</strong></p>
    </div>

    <p>Enter this code on the verification page to verify your email address and complete your account setup.</p>

    <p>If you didn't create an account with Save On Your Home, you can safely ignore this email.</p>

    <p>
        <strong>The Save On Your Home Team</strong>
    </p>
@endsection
