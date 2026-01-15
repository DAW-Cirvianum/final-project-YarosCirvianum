<?php

namespace Database\Factories;

use App\Models\Device;
use App\Models\Owner;
use App\Models\Provider;
use App\Models\RentalContract;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeviceFactory extends Factory
{
    protected $model = Device::class;

    public function definition(): array
    {
        return [
            'owner_id'            => Owner::inRandomOrder()->first()?->id,
            'provider_id'         => Provider::inRandomOrder()->first()?->id,
            'rental_contract_id'  => RentalContract::inRandomOrder()->first()?->id,

            'device_type'         => $this->faker->randomElement(['laptop', 'desktop', 'tablet', 'phone', 'mouse', 'keyboard', 'mouse_keyboard']),
            'brand'               => $this->faker->randomElement(['Dell', 'HP', 'Lenovo', 'Apple']),
            'model'               => $this->faker->word(),
            'serial_number'       => $this->faker->unique()->bothify('SN-########'),
            'inventory_number'    => $this->faker->optional()->bothify('INV-####'),

            'physical_location'   => $this->faker->city(),
            'purchase_date'       => $this->faker->optional()->date(),
            'warranty_end_date'   => $this->faker->optional()->date(),
            'assignment_date'     => $this->faker->optional()->date(),

            'status'              => $this->faker->randomElement(['in_stock', 'assigned', 'repair']),
            'specifications'      => $this->faker->optional()->paragraph(),
            'notes'               => $this->faker->optional()->sentence(),
            'assigned_by'         => $this->faker->optional()->name(),
            'last_maintenance_date'=> $this->faker->optional()->date(),

            'has_warranty'        => $this->faker->boolean(),
            'requires_maintenance'=> $this->faker->boolean(),
            'is_insured'          => $this->faker->boolean(),
            'is_leased'           => $this->faker->boolean(),
        ];
    }
}
