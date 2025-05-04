<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items'; // explicitly define the table

    protected $fillable = [
        'order_id',
        'item_id',
        'units',
        'order_price',
    ];

    protected $casts = [
        'order_id' => 'integer',
        'item_id' => 'integer',
        'units' => 'integer',
        'order_price' => 'float',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
