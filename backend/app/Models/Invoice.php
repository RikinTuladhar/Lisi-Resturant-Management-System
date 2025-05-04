<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    //
    protected $fillable = [
        'discount',
        'total_price',
        'service_charge',
    ];
    public function casts()
    {
        return [
            'user_id' => 'integer',
            'total_price' => 'float',
            'status' => 'string'
        ];
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
