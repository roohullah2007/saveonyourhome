<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    // Listing status constants
    const STATUS_FOR_SALE = 'for_sale';
    const STATUS_PENDING = 'pending';
    const STATUS_SOLD = 'sold';
    const STATUS_INACTIVE = 'inactive';

    const LISTING_STATUSES = [
        self::STATUS_FOR_SALE => 'For Sale',
        self::STATUS_PENDING => 'Pending (Under Contract)',
        self::STATUS_SOLD => 'Sold',
        self::STATUS_INACTIVE => 'Inactive',
    ];

    protected $fillable = [
        'user_id',
        'original_user_id',
        'property_title',
        'listing_headline',
        'developer',
        'property_type',
        'status',
        'transaction_type',
        'listing_status',
        'listing_label',
        'price',
        'monthly_rent',
        'available_from',
        'lease_term',
        'pets_allowed',
        'address',
        'city',
        'state',
        'zip_code',
        'county',
        'subdivision',
        // School Information
        'school_district',
        'grade_school',
        'middle_school',
        'high_school',
        'bedrooms',
        'bathrooms',
        'full_bathrooms',
        'half_bathrooms',
        'sqft',
        'lot_size',
        'acres',
        'zoning',
        'year_built',
        'garage',
        'basement',
        'stories',
        'has_hoa',
        'hoa_fee',
        'annual_property_tax',
        'description',
        'testimonial',
        'testimonial_name',
        'features',
        'photos',
        'contact_name',
        'contact_email',
        'contact_phone',
        'is_featured',
        'is_motivated_seller',
        'is_licensed_agent',
        'virtual_tour_type',
        'virtual_tour_embed',
        'property_dimensions',
        'open_to_realtors',
        'requires_pre_approval',
        'is_showcase',
        'is_active',
        'approval_status',
        'rejection_reason',
        'approved_at',
        'approved_by',
        'sold_at',
        'transferred_at',
        'latitude',
        'longitude',
        'views',
        // Listing tier and upgrade fields
        'listing_tier',
        'has_professional_photos',
        'has_virtual_tour',
        'has_video',
        'virtual_tour_url',
        'video_url',
        'video_tour_url',
        'floor_plan_url',
        'floor_plans',
        'matterport_url',
        'mls_virtual_tour_url',
        'is_mls_listed',
        'mls_number',
        'mls_listed_at',
        'mls_expires_at',
        // Import/claim fields
        'import_source',
        'zillow_id',
        'import_batch_id',
        'claim_token',
        'claim_expires_at',
        'claimed_at',
        'owner_name',
        'owner_mailing_address',
        'owner_phone',
        'owner_email',
        'claim_first_viewed_at',
        'claim_last_viewed_at',
        'claim_view_count',
    ];

    protected $casts = [
        'features' => 'array',
        'photos' => 'array',
        'floor_plans' => 'array',
        'price' => 'decimal:2',
        'bathrooms' => 'decimal:1',
        'acres' => 'decimal:4',
        'is_featured' => 'boolean',
        'is_motivated_seller' => 'boolean',
        'is_licensed_agent' => 'boolean',
        'open_to_realtors' => 'boolean',
        'requires_pre_approval' => 'boolean',
        'is_showcase' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'approved_at' => 'datetime',
        'sold_at' => 'datetime',
        'transferred_at' => 'datetime',
        // Upgrade field casts
        'has_professional_photos' => 'boolean',
        'has_virtual_tour' => 'boolean',
        'has_video' => 'boolean',
        'is_mls_listed' => 'boolean',
        'mls_listed_at' => 'datetime',
        'mls_expires_at' => 'datetime',
        'claim_expires_at' => 'datetime',
        'claimed_at' => 'datetime',
        'claim_first_viewed_at' => 'datetime',
        'claim_last_viewed_at' => 'datetime',
    ];

    protected $appends = ['slug'];

    /**
     * Get the owner of this property
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Alias for user relationship
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the original owner (before transfer to admin)
     */
    public function originalOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'original_user_id');
    }

    /**
     * Get the admin who approved this property
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get property images
     */
    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    /**
     * Get primary image
     */
    public function primaryImage(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('is_primary', true);
    }

    /**
     * Get inquiries for this property
     */
    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Get service requests for this property
     */
    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }

    /**
     * Get pending service requests
     */
    public function pendingServiceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class)->where('status', 'pending');
    }

    /**
     * Get users who favorited this property
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    /**
     * Get QR code scans for this property
     */
    public function qrScans(): HasMany
    {
        return $this->hasMany(QrScan::class);
    }

    /**
     * Get QR sticker for this property
     */
    public function qrSticker(): HasOne
    {
        return $this->hasOne(QrSticker::class);
    }

    /**
     * Get open houses for this property
     */
    public function openHouses(): HasMany
    {
        return $this->hasMany(OpenHouse::class)->orderBy('date')->orderBy('start_time');
    }

    public function showings(): HasMany
    {
        return $this->hasMany(PropertyShowing::class);
    }

    /**
     * Get upcoming open houses for this property
     */
    public function upcomingOpenHouses(): HasMany
    {
        return $this->hasMany(OpenHouse::class)
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('start_time');
    }

    /**
     * Scope for active properties
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for approved properties
     */
    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    /**
     * Scope for pending properties
     */
    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    /**
     * Scope for featured properties
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for publicly visible properties
     */
    public function scopePublic($query)
    {
        return $query->active()->approved();
    }

    /**
     * Scope for listing status
     */
    public function scopeListingStatus($query, $status)
    {
        return $query->where('listing_status', $status);
    }

    /**
     * Scope for for-sale properties
     */
    public function scopeForSale($query)
    {
        return $query->where('listing_status', self::STATUS_FOR_SALE);
    }


    /**
     * Scope for pending (under contract) properties
     */
    public function scopeUnderContract($query)
    {
        return $query->where('listing_status', self::STATUS_PENDING);
    }

    /**
     * Scope for sold properties
     */
    public function scopeSold($query)
    {
        return $query->where('listing_status', self::STATUS_SOLD);
    }

    /**
     * Scope for inactive properties
     */
    public function scopeInactive($query)
    {
        return $query->where('listing_status', self::STATUS_INACTIVE);
    }

    /**
     * Scope for showcase properties (admin-approved for marketing)
     */
    public function scopeShowcase($query)
    {
        return $query->where('is_showcase', true);
    }

    /**
     * Scope for transferred properties
     */
    public function scopeTransferred($query)
    {
        return $query->whereNotNull('transferred_at');
    }

    /**
     * Transfer property to admin account
     */
    public function transferToAdmin(int $adminUserId): void
    {
        $this->update([
            'original_user_id' => $this->user_id,
            'user_id' => $adminUserId,
            'listing_status' => self::STATUS_INACTIVE,
            'is_active' => false,
            'transferred_at' => now(),
        ]);
    }

    /**
     * Mark as sold with timestamp
     */
    public function markAsSold(): void
    {
        $this->update([
            'listing_status' => self::STATUS_SOLD,
            'sold_at' => now(),
        ]);
    }

    /**
     * Check if property was transferred from another user
     */
    public function isTransferred(): bool
    {
        return !is_null($this->transferred_at);
    }

    /**
     * Check if property is a showcase listing
     */
    public function isShowcase(): bool
    {
        return (bool) $this->is_showcase;
    }

    /**
     * Check if listing has a virtual tour
     */
    public function hasVirtualTourUrl(): bool
    {
        return !empty($this->virtual_tour_url) || !empty($this->matterport_url);
    }

    /**
     * Check if listing has a video tour
     */
    public function hasVideoTour(): bool
    {
        return !empty($this->video_tour_url) || !empty($this->video_url);
    }

    /**
     * Get the listing status label
     */
    public function getListingStatusLabelAttribute(): string
    {
        return self::LISTING_STATUSES[$this->listing_status] ?? 'For Sale';
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price, 0);
    }

    /**
     * Get full address
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->city,
            $this->state,
            $this->zip_code
        ]);
        return implode(', ', $parts);
    }

    /**
     * Get URL slug for the property
     */
    public function getSlugAttribute(): string
    {
        $slug = strtolower(trim($this->address ?? ''));
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        $slug = trim($slug, '-');
        return $this->id . '-' . $slug;
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * Resolve route binding with slug support
     */
    public function resolveRouteBinding($value, $field = null)
    {
        // Extract ID from slug (e.g., "2-123-main-street" -> 2)
        if (preg_match('/^(\d+)/', $value, $matches)) {
            return $this->where('id', $matches[1])->firstOrFail();
        }
        return $this->where('id', $value)->firstOrFail();
    }

    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }

    /**
     * Check if property is pending approval
     */
    public function isPending(): bool
    {
        return $this->approval_status === 'pending';
    }

    /**
     * Check if property is approved
     */
    public function isApproved(): bool
    {
        return $this->approval_status === 'approved';
    }

    /**
     * Check if property is rejected
     */
    public function isRejected(): bool
    {
        return $this->approval_status === 'rejected';
    }

    /**
     * Check if listing is free tier
     */
    public function isFreeTier(): bool
    {
        return $this->listing_tier === 'free' || $this->listing_tier === null;
    }

    /**
     * Check if listing has photos upgrade
     */
    public function hasPhotosUpgrade(): bool
    {
        return $this->listing_tier === 'photos' || $this->listing_tier === 'mls';
    }

    /**
     * Check if listing has MLS upgrade
     */
    public function hasMlsUpgrade(): bool
    {
        return $this->listing_tier === 'mls';
    }

    /**
     * Get listing tier label
     */
    public function getListingTierLabelAttribute(): string
    {
        return match($this->listing_tier) {
            'photos' => 'Photos & Multimedia',
            'mls' => 'MLS Listed',
            default => 'Free Listing',
        };
    }

    /**
     * Check if property has any pending upgrade requests
     */
    public function hasPendingUpgrade(): bool
    {
        return $this->serviceRequests()->whereIn('status', ['pending', 'approved', 'in_progress'])->exists();
    }

    /**
     * Get the import batch this property belongs to
     */
    public function importBatch(): BelongsTo
    {
        return $this->belongsTo(ImportBatch::class);
    }

    /**
     * Scope for imported properties
     */
    public function scopeImported($query)
    {
        return $query->whereNotNull('import_source');
    }

    /**
     * Scope for unclaimed imported properties
     */
    public function scopeUnclaimed($query)
    {
        return $query->imported()->whereNull('claimed_at');
    }

    /**
     * Scope for claimed imported properties
     */
    public function scopeClaimed($query)
    {
        return $query->imported()->whereNotNull('claimed_at');
    }

    /**
     * Scope for expired claim tokens
     */
    public function scopeExpiredClaims($query)
    {
        return $query->imported()->whereNull('claimed_at')
            ->where('claim_expires_at', '<=', now());
    }

    public function isImported(): bool
    {
        return !is_null($this->import_source);
    }

    public function isClaimed(): bool
    {
        return !is_null($this->claimed_at);
    }

    public function isClaimExpired(): bool
    {
        return $this->claim_expires_at && $this->claim_expires_at->isPast() && !$this->isClaimed();
    }

    /**
     * Claim this imported property for a user
     */
    public function claim(User $user): void
    {
        $this->update([
            'user_id' => $user->id,
            'listing_status' => self::STATUS_FOR_SALE,
            'status' => 'for-sale',
            'is_active' => true,
            'claimed_at' => now(),
            'contact_name' => $this->owner_name ?? $user->name,
            'contact_email' => $this->owner_email ?? $user->email,
            'contact_phone' => $this->owner_phone ?? '',
        ]);

        // Update batch claimed count
        if ($this->import_batch_id) {
            $this->importBatch?->increment('claimed_count');
        }
    }
}
