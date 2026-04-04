<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'SaveOnYourHome') }}</title>

        <!-- Default SEO Meta (overridden per-page via Inertia Head) -->
        <meta name="description" content="Sell your home for free with SaveOnYourHome. No commissions, no hidden fees. List your FSBO property, connect with buyers, and save thousands." />
        <meta name="keywords" content="FSBO, for sale by owner, sell home without agent, no commission real estate, free home listing, SaveOnYourHome" />
        <meta name="author" content="SaveOnYourHome" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="{{ url()->current() }}" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SaveOnYourHome" />
        <meta property="og:locale" content="en_US" />

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SaveOnYourHome" />

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
