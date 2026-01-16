<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    // GET /admin/users
    public function index()
    {
        return view('admin.users', [
            'users' => User::orderByDesc('id')->get()
        ]);
    }

    // POST /admin/users
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'min:5', 'unique:users,username'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'role'     => ['required', 'string'],
        ]);

        $validated['password']          = Hash::make($validated['password']);
        $validated['email_verified_at'] = now();

        User::create($validated);

        return back()->with('msg', 'User created.');
    }

    // PUT /admin/users/{user}
    public function update(Request $request, User $user)
    {
        if (auth()->id() === $user->id && $request->role !== 'admin') {
            return back()->withErrors(['error' => 'You cannot demote yourself!']);
        }

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'min:5', Rule::unique('users')->ignore($user->id)],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role'     => ['required', 'string'],
            'password' => ['nullable', 'string', 'min:4'],
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('msg', 'User updated.');
    }

    // DELETE /admin/users/{user}
    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->withErrors(['error' => 'Cannot delete yourself.']);
        }

        $user->delete();

        return back()->with('msg', 'User deleted.');
    }
}