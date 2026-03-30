<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'OK By Owner')</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #2563eb;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-header .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .email-body {
            padding: 30px 20px;
        }
        .email-body h2 {
            color: #1f2937;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .email-body p {
            margin: 0 0 15px 0;
            color: #4b5563;
        }
        .property-details {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .property-details h3 {
            margin-top: 0;
            color: #1f2937;
        }
        .property-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .property-details td {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .property-details td:first-child {
            font-weight: 600;
            color: #374151;
            width: 40%;
        }
        .property-details td:last-child {
            color: #6b7280;
        }
        .property-details tr:last-child td {
            border-bottom: none;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 5px 10px 0;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
        .btn-secondary {
            background-color: #6b7280;
        }
        .btn-secondary:hover {
            background-color: #4b5563;
        }
        .email-footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .email-footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .email-footer a {
            color: #2563eb;
            text-decoration: none;
        }
        .highlight {
            background-color: #dbeafe;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .highlight p {
            margin: 0;
            color: #1e40af;
        }
        .user-info {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .user-info h4 {
            margin-top: 0;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <div class="logo">OK By Owner</div>
                <h1>@yield('header-title', 'Notification')</h1>
            </div>
            <div class="email-body">
                @yield('content')
            </div>
            <div class="email-footer">
                <p>&copy; {{ date('Y') }} OK By Owner. All rights reserved.</p>
                <p>Oklahoma's #1 For Sale By Owner Marketplace</p>
                <p><a href="{{ url('/') }}">Visit our website</a></p>
            </div>
        </div>
    </div>
</body>
</html>
