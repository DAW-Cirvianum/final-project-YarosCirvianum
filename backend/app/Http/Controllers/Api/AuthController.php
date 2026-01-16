<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/api/register",
        summary: "Registre d'usuari",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                required: ["name", "username", "email", "password", "password_confirmation"],
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "username", type: "string"),
                    new OA\Property(property: "email", type: "string"),
                    new OA\Property(property: "password", type: "string"),
                    new OA\Property(property: "password_confirmation", type: "string")
                ]
            )
        ),
        responses: [new OA\Response(response: 201, description: "Creat")]
    )]
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => ['required', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
            'username' => ['required', 'string', 'min:5', 'max:15', 'unique:users,username', 'regex:/^[a-z0-9]+$/'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4', 'confirmed'],
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

        return ApiResponse::success([
            'id'       => $user->id,
            'name'     => $user->name,
            'username' => $user->username,
            'email'    => $user->email,
            'role'     => $user->role,
            'verified' => false,
        ], null, 201);
    }

    #[OA\Post(
        path: "/api/login",
        summary: "Login d'usuari",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                required: ["login", "password"],
                properties: [
                    new OA\Property(property: "login", type: "string"),
                    new OA\Property(property: "password", type: "string")
                ]
            )
        ),
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login'    => ['required', 'min:5', 'string'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $field = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $user  = User::where($field, $request->login)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return ApiResponse::error(['credentials' => ['Invalid credentials']], 401);
        }

        if (! $user->hasVerifiedEmail()) {
            return ApiResponse::error(['email' => ['Email not verified']], 403);
        }

        $token = $user->createToken(
            'api-token',
            ['*'],
            Carbon::now()->addHours(1)
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

    #[OA\Post(
        path: "/api/logout",
        summary: "Logout",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
    public function logout(Request $request)
    {
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return ApiResponse::success();
    }

    #[OA\Get(
        path: "/api/profile",
        summary: "Perfil usuari",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
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

    #[OA\Get(
        path: "/api/email/verify/{id}/{hash}",
        summary: "Verificar email",
        tags: ["Auth"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "hash", in: "path", required: true, schema: new OA\Schema(type: "string"))
        ],
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
    public function verifyEmail(Request $request)
    {
        $user = User::find($request->route('id'));

        if (! $user) {
            return ApiResponse::error(['user' => ['Not found']], 404);
        }

        $hashCheck = sha1($user->getEmailForVerification());
        
        if (! hash_equals($hashCheck, (string) $request->route('hash'))) {
            return ApiResponse::error(['verification' => ['Invalid link']], 400);
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return ApiResponse::success(['verified' => true]);
    }
}