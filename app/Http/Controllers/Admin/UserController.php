<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

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



    public function index()
    {
        $users = User::with('roles', 'permissions')->get();
        return Inertia::render('Admin/User/Index', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */

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

}
