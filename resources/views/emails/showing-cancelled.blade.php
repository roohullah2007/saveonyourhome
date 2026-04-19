@extends('emails.layout')

@section('title', 'Viewing cancelled')
@section('header-title', 'Viewing cancelled')

@section('content')
@if($audience === 'buyer')
    <h2>Hi {{ $showing->buyer_name }},</h2>
    @if($cancelledBy === 'seller')
        <p>Unfortunately the seller had to cancel the viewing for <strong>{{ $propertyTitle }}</strong> scheduled for {{ $when }}. We're sorry for the inconvenience.</p>
    @else
        <p>This confirms your viewing for <strong>{{ $propertyTitle }}</strong> on {{ $when }} has been cancelled.</p>
    @endif
@else
    <h2>Hi {{ $showing->seller?->name ?? 'there' }},</h2>
    @if($cancelledBy === 'buyer')
        <p>The buyer ({{ $showing->buyer_name }}) cancelled their viewing for <strong>{{ $propertyTitle }}</strong> on {{ $when }}.</p>
    @else
        <p>This confirms you cancelled the viewing for <strong>{{ $propertyTitle }}</strong> on {{ $when }}.</p>
    @endif
@endif

@if($showing->cancellation_reason)
<div class="highlight"><p><strong>Reason:</strong> {{ $showing->cancellation_reason }}</p></div>
@endif

<p style="margin-top: 20px;">
    @if($audience === 'buyer')
        <a class="btn" href="{{ url('/properties') }}">Browse other listings</a>
    @else
        <a class="btn" href="{{ url('/dashboard/showings') }}">Manage your showings</a>
    @endif
</p>
@endsection
