<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Owner;
use App\Models\Provider;
use App\Models\RentalContract;
use App\Models\Device;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        User::factory()->count(5)->create();

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
