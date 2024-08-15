<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    protected $fillable = ['name', 'title', 'author', 'version', 'description'];

    public function pages()
    {
        return $this->hasMany(Page::class);
    }
}
