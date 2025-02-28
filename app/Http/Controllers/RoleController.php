<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;

class RoleController extends Controller
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
     * Display a listing of the roles.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        
        return Inertia::render('roles/index', [
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $permissions = Permission::all();
        
        return Inertia::render('roles/create', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id']
        ]);
        
        $role = Role::create(['name' => $validated['name']]);
        
        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }
        
        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        $role->load('permissions');
        
        return Inertia::render('roles/show', [
            'role' => $role,
            'permissions' => $role->permissions
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $role->load('permissions');
        $permissions = Permission::all();
        
        return Inertia::render('roles/edit', [
            'role' => $role,
            'rolePermissions' => $role->permissions->pluck('id'),
            'permissions' => $permissions
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role)],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id']
        ]);
        
        $role->update(['name' => $validated['name']]);
        
        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        } else {
            $role->syncPermissions([]);
        }
        
        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        // Prevent deleting super-admin, admin, and other critical roles
        if (in_array($role->name, ['super-admin', 'admin'])) {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete system roles.');
        }
        
        $role->delete();
        
        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
} 