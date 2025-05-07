<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    //
    protected $fillable = [
        'user_id',
        'discount',
        'total_price',
        'service_charge',
        'status'
    ];
    public function casts()
    {
        return [
            'user_id' => 'integer',
            'total_price' => 'float',
            'service_charge' => 'float',
            'status' => 'string',
            'discount' => 'float',
        ];
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
