<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
        'service_type',
        'status',
        'notes',
        'admin_notes',
        'preferred_date',
        'preferred_time',
        'scheduled_at',
        'price',
        'is_paid',
        'paid_at',
        'payment_method',
        'payment_reference',
        'processed_by',
        'processed_at',
        'completed_at',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'scheduled_at' => 'datetime',
        'paid_at' => 'datetime',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
        'price' => 'decimal:2',
        'is_paid' => 'boolean',
    ];

    /**
     * Get the user who made this request
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the property for this request
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the admin who processed this request
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Scope for pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for approved requests
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for in progress requests
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    /**
     * Scope for completed requests
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope by service type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('service_type', $type);
    }

    /**
     * Get service type label
     */
    public function getServiceTypeLabelAttribute(): string
    {
        return match($this->service_type) {
            'photos' => 'Professional Photos',
            'virtual_tour' => 'Virtual Tour',
            'video' => 'Video Walkthrough',
            'mls' => 'MLS Listing',
            'qr_stickers' => 'QR Code Stickers',
            'yard_sign' => 'Yard Sign',
            default => ucfirst(str_replace('_', ' ', $this->service_type)),
        };
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pending Review',
            'approved' => 'Approved',
            'in_progress' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => ucfirst($this->status),
        };
    }

    /**
     * Check if request is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if request is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
