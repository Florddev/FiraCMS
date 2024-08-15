<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{

    protected $fillable = ['name', 'slug', 'initial_path', 'template_id', 'custom_data', 'sections'];

    protected $casts = [
        'custom_data' => 'array',
        'sections' => 'array',
    ];
}
