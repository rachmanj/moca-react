<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions
        $this->call(RoleAndPermissionSeeder::class);

        // User::factory(10)->create();

        // Check if superadmin user already exists
        $superadmin = User::where('username', 'superadmin')->first();
        
        if (!$superadmin) {
            $superadmin = User::factory()->create([
                'name' => 'Omanof Sullivant',
                'username' => 'superadmin',
                'email' => 'oman@gmail.com',
                'password' => Hash::make('12345678'),
                'project' => '000H',
                'department_id' => '19',
            ]);
            
            // Assign the roles to the superadmin user
            $superadmin->assignRole('superadmin', 'admin', 'manager', 'user');
        }
    }
}
