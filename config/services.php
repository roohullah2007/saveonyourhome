<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
        'maps_api_key' => env('GOOGLE_MAPS_API_KEY'),
    ],

    'zillow_rapidapi' => [
        'key' => env('ZILLOW_RAPIDAPI_KEY'),
        'host' => env('ZILLOW_RAPIDAPI_HOST', 'real-estate101.p.rapidapi.com'),
        'images_host' => env('ZILLOW_IMAGES_API_HOST', 'zillow-com1.p.rapidapi.com'),
    ],

    'yelp' => [
        'api_key' => env('YELP_API_KEY'),
    ],

    'walkscore' => [
        'api_key' => env('WALKSCORE_API_KEY'),
    ],

    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
    ],

    'rentcast' => [
        'key' => env('RENTCAST_API_KEY'),
    ],

    'bunnycdn' => [
        'hostname' => env('BUNNYCDN_HOSTNAME'),
        'username' => env('BUNNYCDN_USERNAME'),
        'password' => env('BUNNYCDN_PASSWORD'),
        'port' => env('BUNNYCDN_PORT', 21),
        'pull_zone' => env('BUNNYCDN_PULL_ZONE'),
        'local_backup' => env('BUNNYCDN_LOCAL_BACKUP', false),
    ],

];
