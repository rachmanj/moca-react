<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        // The auth middleware is already applied in the routes file
        // No need to apply additional permission middleware since we're using role:admin|superadmin
        // in the routes file, and superadmin has all permissions via Gate::before
    }

    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        
        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::all();
        
        return Inertia::render('users/create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'project' => ['required', 'string', 'max:255'],
            'department_id' => ['nullable', 'string', 'max:255'],
            'password' => ['required', Password::defaults()],
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id']
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'project' => $validated['project'],
            'department_id' => $validated['department_id'],
            'password' => Hash::make($validated['password']),
        ]);
        
        // Assign roles to the user
        if (isset($validated['roles'])) {
            $roles = Role::whereIn('id', $validated['roles'])->get();
            $user->syncRoles($roles);
        }
        
        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load('roles.permissions');
        
        return Inertia::render('users/show', [
            'user' => $user,
            'roles' => $user->roles,
            'permissions' => $user->getAllPermissions()
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $user->load('roles');
        $roles = Role::all();
        
        return Inertia::render('users/edit', [
            'user' => $user,
            'userRoles' => $user->roles->pluck('id'),
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user)],
            'project' => ['required', 'string', 'max:255'],
            'department_id' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', Password::defaults()],
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id']
        ]);
        
        $userData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'project' => $validated['project'],
            'department_id' => $validated['department_id'],
        ];
        
        // Only update password if provided
        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }
        
        $user->update($userData);
        
        // Sync roles
        if (isset($validated['roles'])) {
            $roles = Role::whereIn('id', $validated['roles'])->get();
            $user->syncRoles($roles);
        } else {
            $user->syncRoles([]);
        }
        
        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting your own account
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }
        
        $user->delete();
        
        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
} 