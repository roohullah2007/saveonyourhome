<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'name',
        'email',
        'phone',
        'message',
        'type',
        'status',
        'admin_notes',
        'read_at',
        'responded_at',
        'seller_reply',
        'seller_replied_at',
        'delivery_method',
        'email_delivered_at',
        'seller_read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'responded_at' => 'datetime',
        'seller_replied_at' => 'datetime',
        'email_delivered_at' => 'datetime',
        'seller_read_at' => 'datetime',
    ];

    /**
     * Get the property this inquiry is about
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the user who made the inquiry
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(MessageReply::class)->with('user:id,name')->orderBy('created_at', 'asc');
    }

    /**
     * Scope for new inquiries
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope for unread inquiries
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Mark inquiry as read
     */
    public function markAsRead(): void
    {
        if (!$this->read_at) {
            $this->update([
                'read_at' => now(),
                'status' => 'read',
            ]);
        }
    }

    /**
     * Mark inquiry as responded
     */
    public function markAsResponded(): void
    {
        $this->update([
            'responded_at' => now(),
            'status' => 'responded',
        ]);
    }

    /**
     * Check if inquiry is new
     */
    public function isNew(): bool
    {
        return $this->status === 'new';
    }

    /**
     * Check if inquiry is read
     */
    public function isRead(): bool
    {
        return !is_null($this->read_at);
    }
}
