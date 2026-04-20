@extends('emails.layout')

@section('title', 'New match for your saved search')
@section('header-title', 'A new listing matches your search')

@section('content')
    <h2>New match for "{{ $savedSearch->name }}"</h2>

    <p>Hi {{ $savedSearch->user->name ?? 'there' }},</p>

    <p>A new listing just went live on SaveOnYourHome that matches your saved search. Here's a quick look:</p>

    <div class="property-details">
        @if(!empty($property->photos[0] ?? null))
            <p style="margin-bottom: 16px;">
                <img src="{{ url('/storage/' . $property->photos[0]) }}" alt="{{ $property->property_title }}" style="width: 100%; max-width: 520px; height: auto; border-radius: 12px;" />
            </p>
        @endif
        <h3>{{ $property->property_title }}</h3>
        <table>
            <tr><td>Price</td><td><strong>${{ number_format((float) $property->price) }}</strong></td></tr>
            <tr><td>Address</td><td>{{ $property->address }}, {{ $property->city }}{{ $property->state ? ', ' . $property->state : '' }} {{ $property->zip_code }}</td></tr>
            @if(($property->property_type ?? '') !== 'land')
                <tr><td>Beds &middot; Baths</td><td>{{ (int) $property->bedrooms }} bd &middot; {{ $property->full_bathrooms ?? $property->bathrooms }} ba{{ $property->half_bathrooms ? ' (+' . $property->half_bathrooms . ' half)' : '' }}</td></tr>
                @if($property->sqft)
                    <tr><td>Size</td><td>{{ number_format((int) $property->sqft) }} sq ft</td></tr>
                @endif
            @else
                @if($property->acres)
                    <tr><td>Lot</td><td>{{ $property->acres }} acres</td></tr>
                @elseif($property->lot_size)
                    <tr><td>Lot</td><td>{{ number_format((int) $property->lot_size) }} sq ft</td></tr>
                @endif
            @endif
        </table>
    </div>

    <p>
        <a href="{{ $propertyUrl }}" class="btn">See the listing</a>
    </p>

    <p style="margin-top: 32px; color: #6B7280; font-size: 13px;">
        You received this because you enabled email alerts on the saved search
        <strong>{{ $savedSearch->name }}</strong>. You can manage all your saved
        searches and alerts from your <a href="{{ $dashboardUrl }}">dashboard</a>,
        or <a href="{{ $unsubscribeUrl }}">turn off alerts for this search</a>.
    </p>
@endsection
