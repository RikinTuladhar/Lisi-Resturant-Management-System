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

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:items,name',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
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
