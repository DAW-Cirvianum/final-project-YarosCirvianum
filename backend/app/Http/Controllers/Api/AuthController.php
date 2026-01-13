<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

// Per expirar el token
use Carbon\Carbon;

use App\Http\Controllers\Controller;
use App\Models\User;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'       => ['required', 'string', 'max:255'],
            'username'   => ['required', 'string', 'max:255', 'unique:users,username'],
            'email'      => ['required', 'string', 'email','max:255', 'unique:users,email'],
            'password'   => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validate();

        $user = User::create([
            'name'      => $data['name'],
            'username'  => $data['username'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'User created. Check your email to verify your account.',
            'user'    => $user,
        ], 201); // status 201 significa - Created
    }

    public function verifyEmail(Request $request)
    {
        $id       = $request->route('id');
        $hash     = $request->route('hash');

        $user     = User::findOrFail($id);

        $userHash = sha1($user->getEmailForVerification());

        if (! hash_equals($hash, $userHash)) {
            return response()->json([
                'message' => 'Invalid verification link.',
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.',
            ], 200);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'message' => 'Email verified successfully.',
        ], 200);
    }
    
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'message'    => 'User profile information.',
            'user'       => $user
        ], 200);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login'      => ['required', 'string'],
            'password'   => ['required', 'string'],
        ]);

        if (filter_var($request->login, FILTER_VALIDATE_EMAIL)) {
            $loginWith = 'email';
        } else {
            $loginWith = 'username';
        }

        if ($validator->fails()) {
            return response()->json([
                'status'   => false,
                'message'  => 'Validation error',
                'errors'   => $validator->errors(),
            ], 422);
        }

        $user = User::where($loginWith, $request->login)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (! $user->hasVerifiedEmail()) {
            return response()->json([
                'status'  => false,
                'message' => 'Email not verified. Please check your inbox.',
            ], 403);
        }

        // Afegir expiracio al token
        $token = $user->createToken(
            'api-token',
            ['*'],
            Carbon::now()->addHours(1)
        )->plainTextToken;

        return response()->json([
            'status'  => true,
            'token'   => $token,
            'user'    => [
                'email'  => $user->email,
            ],
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    // Borrar tots els tokens?
    // public function logout(Request $request)
    // {
    //     $user = $request->user();
    //     $user->tokens()->delete();

    //     return response()->json([
    //         'message' => 'Logged out successfully.',
    //     ]);
    // }
}
