<?php

namespace App\Http\Controllers;

use App\Traits\DataTableTrait;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User; // Remplacez par votre modèle

class DataTableController extends Controller
{
    use DataTableTrait;

    public function getUsers(Request $request)
    {
        return $this->getDataTableData($request, User::class, [
            'searchableFields' => ['name', 'email'],
//            'with' => ['roles'],
            'columns' => ['id', 'name', 'email', 'created_at'],
            'defaultPerPage' => 10,
//            'conditions' => function ($query) {
//                $query->where('is_active', true);
//            }
        ]);
    }

//    public function getPosts(Request $request)
//    {
//        return $this->getDataTableData($request, Post::class, [
//            'searchableFields' => ['title', 'content'],
//            'with' => ['author', 'categories'],
//            'defaultPerPage' => 20,
//        ]);
//    }
}
