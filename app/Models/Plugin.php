<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plugin extends Model
{
    protected $fillable = ['name', 'directory', 'enabled'];

    protected $casts = [
        'enabled' => 'boolean',
    ];
}
