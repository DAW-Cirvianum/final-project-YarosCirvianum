<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

class RecoveryController extends Controller
{
    #[OA\Post(
        path: "/api/password/forgot",
        summary: "Sol·licitar enllaç de recuperació de contrasenya",
        tags: ["Recovery"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "usuari@exemple.com")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Enllaç enviat (o simulat per seguretat)")
        ]
    )]
    // POST /api/password/forgot
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        // Seguretat: No revelem si l'email existeix a la base de dades
        Password::sendResetLink($request->only('email'));

        return ApiResponse::success(['sent' => true]);
    }

    #[OA\Post(
        path: "/api/password/reset",
        summary: "Restablir contrasenya amb token",
        tags: ["Recovery"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["token", "email", "password", "password_confirmation"],
                properties: [
                    new OA\Property(property: "token", type: "string"),
                    new OA\Property(property: "email", type: "string", format: "email"),
                    new OA\Property(property: "password", type: "string", format: "password", minLength: 6),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Contrasenya restablerta"),
            new OA\Response(response: 400, description: "Token o dades invàlides")
        ]
    )]
    // POST /api/password/reset
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token'    => ['required', 'string'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password'       => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Opcional: Invalidar tokens existents per forçar re-login
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return ApiResponse::error(['password' => ['Unable to reset password']], 400);
        }

        return ApiResponse::success(['reset' => true]);
    }

    #[OA\Post(
        path: "/api/email/resend-verification",
        summary: "Reenviar email de verificació",
        tags: ["Recovery"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Email enviat"),
            new OA\Response(response: 401, description: "No autenticat")
        ]
    )]
    // POST /api/email/resend-verification
    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return ApiResponse::error(['auth' => ['Unauthorized']], 401);
        }

        if ($user->hasVerifiedEmail()) {
            return ApiResponse::success(['verified' => true]);
        }

        $user->sendEmailVerificationNotification();

        return ApiResponse::success([
            'verified' => false,
            'sent'     => true,
        ]);
    }
}