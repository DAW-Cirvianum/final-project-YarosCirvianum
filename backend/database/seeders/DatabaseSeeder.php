<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Owner;
use App\Models\Provider;
use App\Models\RentalContract;
use App\Models\Device;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Usuari default per accedir a la consola Admin
        User::factory()->create([
            'name'              => 'Admin',
            'username'          => 'admin',
            'email'             => 'admin@admin.com',
            'password'          => Hash::make('123123'),
            'role'              => 'admin',
            'email_verified_at' => now(),
        ]);
        // Users
        User::factory()->count(3)->create();

        // Owners
        Owner::factory()->count(10)->create();

        // Providers
        Provider::factory()->count(5)->create();

        // Rental Contracts
        RentalContract::factory()->count(8)->create();

        // Devices
        Device::factory()->count(30)->create();
    }
}
