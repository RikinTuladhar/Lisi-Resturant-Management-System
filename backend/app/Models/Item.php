<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    //
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'price'
    ];
    public function casts()
    {
        return [
            'name' => 'string',
            'description' => 'string',
            'category_id' => 'integer',
            'price' => 'float',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    


}
