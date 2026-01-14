<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RecoveryController extends Controller
{
    // POST /api/password/forgot
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        // IMPORTANT:
        // No exposem si l’email existeix o no (seguretat)
        Password::sendResetLink(
            $request->only('email')
        );

        return ApiResponse::success([
            'sent' => true,
        ]);
    }

    // POST /api/password/reset
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token'                 => ['required', 'string'],
            'email'                 => ['required', 'email'],
            'password'              => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $status = Password::reset(
            $request->only(
                'email',
                'password',
                'password_confirmation',
                'token'
            ),
            function ($user) use ($request) {
                $user->forceFill([
                    'password'       => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Invalidem tots els tokens existents
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return ApiResponse::error([
                'password' => ['Unable to reset password'],
            ], 400);
        }

        return ApiResponse::success([
            'reset' => true,
        ]);
    }

    // POST /api/email/resend-verification
    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return ApiResponse::error(['auth' => ['Unauthorized']], 401);
        }

        if ($user->hasVerifiedEmail()) {
            return ApiResponse::success([
                'verified' => true,
            ]);
        }

        $user->sendEmailVerificationNotification();

        return ApiResponse::success([
            'verified' => false,
            'sent'     => true,
        ]);
    }
}
