<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //

    protected $fillable = ['name'];

    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getRules(){
        return [
            'name' => 'required|string|max:255',
        ];
    }

    public function foodItems()
    {
        return $this->hasMany(FoodItem::class);
    }
}
