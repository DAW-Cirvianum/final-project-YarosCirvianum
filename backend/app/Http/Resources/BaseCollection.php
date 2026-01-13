<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BaseCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'status' => true,
            'data' => $this->collection,
            'meta' => $this->getMeta(),
            'links' => $this->getLinks(),
        ];
    }
    
    /**
     * Get pagination meta data.
     */
    protected function getMeta(): array
    {
        // Comprovar si és paginat
        if (method_exists($this->resource, 'total')) {
            return [
                'total' => $this->total(),
                'count' => $this->count(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'total_pages' => $this->lastPage(),
                'from' => $this->firstItem(),
                'to' => $this->lastItem(),
            ];
        }
        
        // Si no és paginat (per si es fa get() enlloc de paginate())
        return [
            'total' => $this->count(),
            'count' => $this->count(),
        ];
    }
    
    /**
     * Get pagination links.
     */
    protected function getLinks(): array
    {
        // Comprovar si és paginat
        if (method_exists($this->resource, 'total')) {
            return [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ];
        }
        
        return [];
    }
    
    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse($request, $response)
    {
        $response->setStatusCode(200);
        parent::withResponse($request, $response);
    }
}