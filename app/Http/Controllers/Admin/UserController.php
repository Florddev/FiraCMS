<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\DataTableTrait;
use Florddev\LaravelAutoRouting\Attributes\HttpDelete;
use Florddev\LaravelAutoRouting\Attributes\HttpGet;
use Florddev\LaravelAutoRouting\Attributes\HttpPatch;
use Florddev\LaravelAutoRouting\Attributes\HttpPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    use DataTableTrait;

    #[HttpGet]
    public function index()
    {
        return Inertia::render('Admin/User/Index');
    }

//    public function index()
//    {
//        $users = User::with('roles', 'permissions')->get();
//        return Inertia::render('Admin/User/Index', ['users' => $users]);
//    }

    #[HttpGet]
    public function getUsers(Request $request)
    {
        return $this->getDataTableData($request, User::class, [
            'searchableFields' => ['name', 'email'],
            'with' => ['roles', 'permissions'],
            'columns' => ['id', 'name', 'email', 'email_verified_at', 'created_at'],
            'defaultPerPage' => 10,
        ]);
    }

    #[HttpGet]
    public function getUsersTest(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = 20; // Nombre d'éléments par page

        $items = User::where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->paginate($perPage)
            ->through(function ($item) {
                return $item;
            });

        return response()->json($items);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[HttpGet]
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    #[HttpPost]
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    #[HttpGet]
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    #[HttpGet]
    public function edit(User $user)
    {
        $roles = Role::all();
        $permissions = Permission::all();
        return Inertia::render('Admin/User/Edit', [
            'user' => $user->load('roles', 'permissions'),
            'allRoles' => $roles,
            'allPermissions' => $permissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[HttpPatch]
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user->syncRoles($validated['roles'] ?? []);
        $user->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    #[HttpDelete]
    public function destroy(string $id)
    {
        //
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        User::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Les utilisateurs sélectionnés ont été supprimés.');
    }


    #[HttpGet]
    public function list(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('orderBy')) {
            $query->orderBy($request->orderBy, $request->direction ?? 'asc');
        }

        if ($request->filled('max')) {
            $query->take($request->input('max'));
        }

        $perPage = $request->input('per_page') ?? 10;
        $users = $query->paginate($perPage);

        return Inertia::render('Admin/User/UserList', [
            'data' => $users,
            'defaultPerPage' => $perPage
        ]);
    }



}
