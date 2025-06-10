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

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'total_price' => 'required|numeric',
            // 'user_id' => 'required|integer|exists:users,id',
            'status' => 'required|string|in:pending,completed,canceled',
        ];
    }

    public function orderItemRules()
    {
        return [
            'item_id' => 'required|exists:items,id',
            'units' => 'required|integer|min:1',
            'order_price' => 'required|numeric|min:0',
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
        return $this->hasOne(Invoice::class);
    }
}
