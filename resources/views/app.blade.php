<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php($seoMeta = $seoMeta ?? null)
        <title inertia>{{ $seoMeta['title'] ?? config('app.name', 'SaveOnYourHome') }}</title>

        <!-- Default SEO Meta (overridden per-page via Inertia Head or controller-shared $seoMeta) -->
        <meta name="description" content="{{ $seoMeta['description'] ?? 'Sell your home for free with SaveOnYourHome. No commissions, no hidden fees. List your FSBO property, connect with buyers, and save thousands.' }}" />
        <meta name="keywords" content="FSBO, for sale by owner, sell home without agent, no commission real estate, free home listing, SaveOnYourHome" />
        <meta name="author" content="SaveOnYourHome" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="{{ $seoMeta['url'] ?? url()->current() }}" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="{{ $seoMeta['type'] ?? 'website' }}" />
        <meta property="og:site_name" content="SaveOnYourHome" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="{{ $seoMeta['title'] ?? config('app.name', 'SaveOnYourHome') }}" />
        <meta property="og:description" content="{{ $seoMeta['description'] ?? 'Sell your home for free with SaveOnYourHome. No commissions, no hidden fees.' }}" />
        <meta property="og:url" content="{{ $seoMeta['url'] ?? url()->current() }}" />
        @if(!empty($seoMeta['image']))
            <meta property="og:image" content="{{ $seoMeta['image'] }}" />
            <meta property="og:image:secure_url" content="{{ $seoMeta['image'] }}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="{{ $seoMeta['title'] ?? 'SaveOnYourHome listing' }}" />
        @endif

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SaveOnYourHome" />
        <meta name="twitter:title" content="{{ $seoMeta['title'] ?? config('app.name', 'SaveOnYourHome') }}" />
        <meta name="twitter:description" content="{{ $seoMeta['description'] ?? 'Sell your home for free with SaveOnYourHome.' }}" />
        @if(!empty($seoMeta['image']))
            <meta name="twitter:image" content="{{ $seoMeta['image'] }}" />
        @endif

        <!-- Favicon & Icons -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1A1816" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
