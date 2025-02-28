<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Automatically give "superadmin" role all permissions
        // This is useful for development and gives you a user that can do everything
        Gate::before(function ($user, $ability) {
            return $user->hasRole('superadmin') ? true : null;
        });
    }
} 