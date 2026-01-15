<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

use Carbon\Carbon;

class AuthController extends Controller
{
    // POST /api/register
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => ['required', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
            'username'    => ['required', 'string', 'min:5', 'max:15', 'unique:users,username', 'regex:/^[a-z0-9]+$/'],
            'email'       => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:4', 'confirmed'],
            // 'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $user = User::create([
            'name'     => $request->name,
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->sendEmailVerificationNotification();

        return ApiResponse::success(
            [
                'id'       => $user->id,
                'name'     => $user->name,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
                'verified' => false,
            ],
            null,
            201
        );
    }

    // POST /api/login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login'    => ['required', 'min:5', 'string'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $field = filter_var($request->login, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'username';

        $user = User::where($field, $request->login)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return ApiResponse::error([
                'credentials' => ['Invalid credentials'],
            ], 401);
        }

        if (! $user->hasVerifiedEmail()) {
            return ApiResponse::error([
                'email' => ['Email not verified'],
            ], 403);
        }

        $token = $user->createToken(
            'api-token',
            ['*'],
            Carbon::now()->addHours(3)
        )->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
            'user'  => [
                'id'       => $user->id,
                'name'     => $user->name,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
            ],
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return ApiResponse::success();
    }

    // GET /api/profile
    public function profile(Request $request)
    {
        $user = $request->user();

        return ApiResponse::success([
            'id'       => $user->id,
            'name'     => $user->name,
            'username' => $user->username,
            'email'    => $user->email,
            'role'     => $user->role,
            'verified' => $user->hasVerifiedEmail(),
        ]);
    }

    // GET /api/email/verify/{id}/{hash}
    public function verifyEmail(Request $request)
    {
        $user = User::find($request->route('id'));

        if (! $user) {
            return ApiResponse::error(['user' => ['Not found']], 404);
        }

        if (! hash_equals(
            sha1($user->getEmailForVerification()),
            $request->route('hash')
        )) {
            return ApiResponse::error(['verification' => ['Invalid link']], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return ApiResponse::success([
                'verified' => true,
            ]);
        }

        $user->markEmailAsVerified();

        return ApiResponse::success([
            'verified' => true,
        ]);
    }
}
