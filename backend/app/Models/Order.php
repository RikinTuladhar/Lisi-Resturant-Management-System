<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        'name',
        'total_price',
        'invoice_id',
        'user_id',
        'status'
    ];
    public function casts()
    {
        return [
            'name' => 'string',
            'total_price' => 'float',
            'invoice_id' => 'integer',
            'user_id' => 'integer',
            'status' => OrderStatus::class,
        ];
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
