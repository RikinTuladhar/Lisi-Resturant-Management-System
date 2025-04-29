<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodItem extends Model
{
    //

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
