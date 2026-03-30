@extends('emails.layout')

@section('header-title', 'Import Complete')

@section('content')
    <h2>CSV Import Completed</h2>

    <p>Your FSBO CSV import has finished processing.</p>

    <div class="property-details">
        <h3>Import Summary</h3>
        <table>
            <tr>
                <td>File</td>
                <td>{{ $batch->original_filename }}</td>
            </tr>
            <tr>
                <td>Source</td>
                <td>{{ ucfirst($batch->source) }}</td>
            </tr>
            <tr>
                <td>Total Records</td>
                <td>{{ $batch->total_records }}</td>
            </tr>
            <tr>
                <td>Successfully Imported</td>
                <td>{{ $batch->imported_count }}</td>
            </tr>
            @if($batch->failed_count > 0)
            <tr>
                <td>Failed</td>
                <td style="color: #dc2626;">{{ $batch->failed_count }}</td>
            </tr>
            @endif
            <tr>
                <td>Claim Expires</td>
                <td>{{ $batch->expires_at->format('F j, Y') }}</td>
            </tr>
        </table>
    </div>

    <p>You can now download and mail claim letters to property owners.</p>

    <a href="{{ $batchUrl }}" class="btn">View Batch Details</a>
@endsection
