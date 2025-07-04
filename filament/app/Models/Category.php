<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    //
    use SoftDeletes;
    protected $fillable = [
        'name',
    ];

    public function casts()
    {
        return [
            'name' => 'string'
        ];
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:categories,name',
        ];
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
