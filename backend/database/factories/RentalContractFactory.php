<?php

namespace Database\Factories;

use App\Models\RentalContract;
use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

class RentalContractFactory extends Factory
{
    protected $model = RentalContract::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-2 years', 'now');
        $end   = (clone $start)->modify('+3 years');

        return [
            'provider_id'     => Provider::inRandomOrder()->first()->id,
            'contract_number' => $this->faker->unique()->bothify('RC-####'),
            'name'            => 'Rental Contract ' . $this->faker->word(),
            'pdf_filename'    => null,
            'start_date'      => $start,
            'end_date'        => $end,
            'monthly_cost'    => $this->faker->randomFloat(2, 50, 500),
            'status'          => 'active',
            'terms'           => $this->faker->optional()->paragraph(),
            'notes'           => $this->faker->optional()->sentence(),
        ];
    }
}
