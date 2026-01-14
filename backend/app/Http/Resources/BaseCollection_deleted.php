<?php

// namespace App\Http\Resources;

// use Illuminate\Http\Request;
// use Illuminate\Http\Resources\Json\ResourceCollection;

// class BaseCollection extends ResourceCollection
// {
//     /**
//      * Transform the resource collection into an array.
//      *
//      * @return array<string, mixed>
//      */
//     public function toArray(Request $request): array
//     {
//         return [
//             'status' => true,
//             'data' => $this->collection,
//         ];
//     }

//     /**
//      * Customize the outgoing response for the resource.
//      */
//     public function withResponse($request, $response)
//     {
//         $response->setStatusCode(200);
        
//         // Para evitar que Laravel afegeixi meta y links duplicats
//         if ($this->resource instanceof \Illuminate\Pagination\AbstractPaginator) {
//             $this->withPagination($response);
//         }
        
//         parent::withResponse($request, $response);
//     }
    
//     /**
//      * Add pagination information to the response.
//      */
//     protected function withPagination($response)
//     {
//         // Aquí no cal afegir res perque Laravel com he vist ja afegeix les metadades sol
//         // Per assegurar que no es dupliquin no cal posar res
//     }
// }