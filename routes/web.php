<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin routes - allow both admin and superadmin roles
    Route::middleware(['role:admin|superadmin'])->group(function () {
        Route::get('admin/dashboard', function () {
            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'users' => User::count(),
                    'roles' => Role::count(),
                    'permissions' => Permission::count(),
                ]
            ]);
        })->name('admin.dashboard');
        
        // User management routes
        Route::resource('users', UserController::class);
        
        // Role management routes
        Route::resource('roles', RoleController::class);
        
        // Permission management routes
        Route::resource('permissions', PermissionController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/platform.php';
