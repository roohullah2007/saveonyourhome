<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'sms_consent',
        'subject',
        'message',
        'status',
        'admin_notes',
        'read_at',
        'responded_at',
    ];

    protected $casts = [
        'sms_consent' => 'boolean',
        'read_at' => 'datetime',
        'responded_at' => 'datetime',
    ];

    /**
     * Scope for new messages
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope for unread messages
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Mark message as read
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
     * Mark message as responded
     */
    public function markAsResponded(): void
    {
        $this->update([
            'responded_at' => now(),
            'status' => 'responded',
        ]);
    }

    /**
     * Check if message is new
     */
    public function isNew(): bool
    {
        return $this->status === 'new';
    }
}
