<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    // Retorna una resposta d'exit estandarditzada
    public static function success(
        $data = null,
        array $meta = null,
        int $code = 200
    ): JsonResponse {
        return response()->json([
            'ok'     => true,
            'data'   => $data,
            'meta'   => $meta,
            'errors' => null,
        ], $code);
    }

    // Retorna una resposta d'error controlada
    public static function error(
        array $errors,
        int $code = 422
    ): JsonResponse {
        return response()->json([
            'ok'     => false,
            'data'   => null,
            'meta'   => null,
            'errors' => $errors,
        ], $code);
    }
}