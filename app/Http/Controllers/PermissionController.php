<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        // Auth and role middleware are already applied in the routes file
        // The superadmin role has all permissions via Gate::before in AuthServiceProvider
    }

    /**
     * Display a listing of the permissions.
     */
    public function index()
    {
        $permissions = Permission::all();
        
        return Inertia::render('permissions/index', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create()
    {
        return Inertia::render('permissions/create');
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions']
        ]);
        
        Permission::create(['name' => $validated['name']]);
        
        return redirect()->route('permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission)
    {
        $roles = $permission->roles;
        
        return Inertia::render('permissions/show', [
            'permission' => $permission,
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission)
    {
        return Inertia::render('permissions/edit', [
            'permission' => $permission
        ]);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions')->ignore($permission)]
        ]);
        
        $permission->update(['name' => $validated['name']]);
        
        return redirect()->route('permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy(Permission $permission)
    {
        // Check if this permission is used by any roles
        if ($permission->roles->count() > 0) {
            return redirect()->route('permissions.index')
                ->with('error', 'Cannot delete permission that is assigned to roles.');
        }
        
        $permission->delete();
        
        return redirect()->route('permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
} 