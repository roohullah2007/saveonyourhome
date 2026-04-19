<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'city',
        'state',
        'zip_code',
        'profile_photo',
        'is_active',
        'last_login_at',
        'google_id',
        'avatar',
        'verification_code',
        'verification_code_expires_at',
        'sms_consent',
        'sms_consent_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'verification_code_expires_at' => 'datetime',
            'sms_consent' => 'boolean',
            'sms_consent_at' => 'datetime',
        ];
    }

    /**
     * Generate a new verification code
     */
    public function generateVerificationCode(): string
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->verification_code = $code;
        $this->verification_code_expires_at = now()->addMinutes(15);
        $this->save();
        return $code;
    }

    /**
     * Check if verification code is valid
     */
    public function isVerificationCodeValid(string $code): bool
    {
        return $this->verification_code === $code
            && $this->verification_code_expires_at
            && $this->verification_code_expires_at->isFuture();
    }

    /**
     * Mark email as verified and clear verification code
     */
    public function markEmailAsVerified(): bool
    {
        $this->email_verified_at = now();
        $this->verification_code = null;
        $this->verification_code_expires_at = null;
        return $this->save();
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is seller
     */
    public function isSeller(): bool
    {
        return $this->role === 'seller';
    }

    /**
     * Check if user is buyer
     */
    public function isBuyer(): bool
    {
        return $this->role === 'buyer';
    }

    /**
     * Check if user is agent
     */
    public function isAgent(): bool
    {
        return $this->role === 'agent';
    }

    /**
     * Get properties owned by this user
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Get properties approved by this admin
     */
    public function approvedProperties(): HasMany
    {
        return $this->hasMany(Property::class, 'approved_by');
    }

    /**
     * Get inquiries made by this user
     */
    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Get favorite properties
     */
    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Property::class, 'favorites')->withTimestamps();
    }

    /**
     * Get activity logs for this user
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * Get service requests made by this user
     */
    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }

    public function savedSearches(): HasMany
    {
        return $this->hasMany(SavedSearch::class);
    }

    public function messagePreference(): HasOne
    {
        return $this->hasOne(SellerMessagePreference::class);
    }

    public function availabilityRules(): HasMany
    {
        return $this->hasMany(SellerAvailabilityRule::class);
    }

    public function sellerShowings(): HasMany
    {
        return $this->hasMany(PropertyShowing::class, 'seller_user_id');
    }

    public function buyerShowings(): HasMany
    {
        return $this->hasMany(PropertyShowing::class, 'buyer_user_id');
    }

    public function externalCalendars(): HasMany
    {
        return $this->hasMany(ExternalCalendar::class);
    }

    public function ensureCalendarFeedToken(): string
    {
        if (!$this->calendar_feed_token) {
            $this->calendar_feed_token = \Illuminate\Support\Str::random(48);
            $this->save();
        }
        return $this->calendar_feed_token;
    }

    /**
     * Get user's full address
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
     * Get user initials
     */
    public function getInitialsAttribute(): string
    {
        $names = explode(' ', $this->name);
        $initials = '';
        foreach ($names as $name) {
            $initials .= strtoupper(substr($name, 0, 1));
        }
        return substr($initials, 0, 2);
    }
}
