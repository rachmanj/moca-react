<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        $permissions = [
            // User permissions
            'view users', 'create users', 'edit users', 'delete users',
            // Inventory permissions
            'view inventory', 'create inventory', 'edit inventory', 'delete inventory',
            // GRPO permissions
            'view grpo', 'create grpo', 'edit grpo', 'delete grpo',
            // MIGI permissions
            'view migi', 'create migi', 'edit migi', 'delete migi',
            // Oldcore permissions
            'view oldcore', 'create oldcore', 'edit oldcore', 'delete oldcore',
        ];

        // Create permissions if they don't exist
        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // Define roles
        $roles = [
            'admin' => $permissions,
            'manager' => [
                'view users', 'view inventory', 'view grpo', 'view migi', 'view oldcore',
                'create inventory', 'edit inventory',
                'create grpo', 'edit grpo',
                'create migi', 'edit migi',
                'create oldcore', 'edit oldcore'
            ],
            'user' => [
                'view inventory', 'view grpo', 'view migi', 'view oldcore'
            ],
            'superadmin' => [] // Superadmin gets all permissions via Gate::before rule
        ];

        // Create roles and assign permissions
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::findOrCreate($roleName);
            
            if (!empty($rolePermissions)) {
                $role->syncPermissions($rolePermissions);
            }
        }
    }
} 