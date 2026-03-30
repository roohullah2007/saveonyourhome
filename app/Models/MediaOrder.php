<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        // Customer Info
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',

        // Property Info
        'property_id',
        'address',
        'city',
        'state',
        'zip_code',
        'sqft_range',
        'property_type',
        'vacant',
        'lockbox_code',

        // Photo Package
        'photo_package',
        'photo_price',

        // Additional Media
        'additional_media',
        'additional_media_price',

        // MLS Options
        'mls_package',
        'mls_price',
        'mls_signers',

        // Broker Assisted
        'broker_assisted',
        'broker_package',

        // Virtual Twilight
        'virtual_twilight_count',
        'virtual_twilight_price',

        // Scheduling
        'preferred_date_1',
        'preferred_time_1',
        'preferred_date_2',
        'preferred_time_2',
        'scheduled_at',
        'special_instructions',

        // Totals
        'total_price',

        // Status & Payment
        'status',
        'is_paid',
        'payment_method',
        'paid_at',

        // Admin
        'admin_notes',
        'processed_by',
    ];

    protected $casts = [
        'additional_media' => 'array',
        'mls_signers' => 'array',
        'broker_assisted' => 'boolean',
        'vacant' => 'boolean',
        'is_paid' => 'boolean',
        'preferred_date_1' => 'date',
        'preferred_date_2' => 'date',
        'scheduled_at' => 'datetime',
        'paid_at' => 'datetime',
        'photo_price' => 'decimal:2',
        'additional_media_price' => 'decimal:2',
        'mls_price' => 'decimal:2',
        'virtual_twilight_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Get the user who placed this order
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the property associated with this order
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the admin who processed this order
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Get the customer's full name
     */
    public function getFullNameAttribute(): string
    {
        if ($this->user) {
            return $this->user->name;
        }
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get a readable status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending Review',
            'confirmed' => 'Confirmed',
            'scheduled' => 'Scheduled',
            'in_progress' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get the photo package label
     */
    public function getPhotoPackageLabelAttribute(): string
    {
        return match ($this->photo_package) {
            'photos' => 'Photos Only',
            'photosDrone' => 'Photos + Drone',
            default => $this->photo_package,
        };
    }

    /**
     * Get the MLS package label
     */
    public function getMlsPackageLabelAttribute(): ?string
    {
        return match ($this->mls_package) {
            'basic' => 'Basic MLS ($250)',
            'deluxe' => 'MLS Deluxe ($350)',
            null => null,
            default => $this->mls_package,
        };
    }

    /**
     * Get list of selected additional media services
     */
    public function getSelectedMediaServicesAttribute(): array
    {
        $services = [];
        $media = $this->additional_media ?? [];

        if (!empty($media['zillow3D'])) $services[] = 'Zillow 3D + Floor Plan';
        if (!empty($media['videoWalkthrough'])) $services[] = 'Video Walkthrough';
        if (!empty($media['matterport'])) $services[] = 'Matterport 3D Tour';
        if (!empty($media['reelsTikTok'])) $services[] = 'Reels/TikTok Video';
        if (!empty($media['floorPlan'])) $services[] = 'Floor Plan';
        if (!empty($media['virtualTwilight'])) {
            $count = $media['virtualTwilightCount'] ?? 1;
            $services[] = "Virtual Twilight ({$count} photos)";
        }

        return $services;
    }

    /**
     * Scope for pending orders
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for confirmed orders
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    /**
     * Scope for scheduled orders
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope for completed orders
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope for orders with MLS
     */
    public function scopeWithMls($query)
    {
        return $query->whereNotNull('mls_package');
    }

    /**
     * Scope for orders with broker assistance
     */
    public function scopeWithBrokerAssistance($query)
    {
        return $query->where('broker_assisted', true);
    }
}
