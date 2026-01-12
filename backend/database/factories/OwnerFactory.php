<?php

namespace Database\Factories;

use App\Models\Owner;
use Illuminate\Database\Eloquent\Factories\Factory;

class OwnerFactory extends Factory
{
    protected $model = Owner::class;

    public function definition(): array
    {
        return [
            'owner_name'    => $this->faker->name(),
            'email'         => $this->faker->unique()->safeEmail(),
            'department'    => $this->faker->randomElement(['IT', 'HR', 'Finance', 'Operations']),
            'location'      => $this->faker->city(),
            'employee_code' => $this->faker->optional()->bothify('EMP-###'),
            'phone'         => $this->faker->optional()->phoneNumber(),
            'extension'     => $this->faker->optional()->numerify('###'),
            'is_active'     => 1,
        ];
    }
}
