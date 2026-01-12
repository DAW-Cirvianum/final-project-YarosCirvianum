<?php

namespace Database\Factories;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderFactory extends Factory
{
    protected $model = Provider::class;

    public function definition(): array
    {
        return [
            'name'            => $this->faker->company(),
            'contact_person'  => $this->faker->optional()->name(),
            'contact_email'   => $this->faker->optional()->companyEmail(),
            'contact_phone'   => $this->faker->optional()->phoneNumber(),
            'address'         => $this->faker->optional()->address(),
            'tax_id'          => $this->faker->optional()->bothify('TAX-######'),
            'website'         => $this->faker->optional()->url(),
            'provider_type'   => 'rental',
            'notes'           => $this->faker->optional()->sentence(),
            'is_active'       => 1,
        ];
    }
}
