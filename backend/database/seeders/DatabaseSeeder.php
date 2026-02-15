<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@demo.com'],
            ['name' => 'Demo Admin', 'password' => Hash::make('password123'), 'role' => 'admin']
        );

        User::updateOrCreate(
            ['email' => 'validator@demo.com'],
            ['name' => 'Demo Validator', 'password' => Hash::make('password123'), 'role' => 'validator']
        );

        User::updateOrCreate(
            ['email' => 'user@demo.com'],
            ['name' => 'Demo User', 'password' => Hash::make('password123'), 'role' => 'user']
        );
    }
}
