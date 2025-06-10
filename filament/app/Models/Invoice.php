<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'user_id',
        'discount',
        'total_price',
        'service_charge',
        'status',
        'order_id'
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'total_price' => 'decimal:2',
            'service_charge' => 'decimal:2',
            'status' => 'string',
            'discount' => 'decimal:2',
            'order_id' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
