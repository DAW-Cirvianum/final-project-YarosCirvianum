<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Users</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen p-8 text-sm">
    <div class="max-w-6xl mx-auto">
        
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
            <div class="flex items-center gap-4">
                <a href="http://localhost:5173" class="text-gray-500 hover:text-black underline">Go to React App</a>
                <form action="{{ route('admin.logout') }}" method="POST">
                    @csrf
                    <button class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Logout</button>
                </form>
            </div>
        </div>

        @if(session('success'))
            <div class="bg-green-100 text-green-800 p-3 rounded mb-4">{{ session('success') }}</div>
        @endif
        @if($errors->any())
            <div class="bg-red-100 text-red-800 p-3 rounded mb-4">
                <ul class="list-disc pl-4">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 class="font-bold uppercase tracking-widest text-xs text-gray-500 mb-4">Create New User</h2>
            <form action="{{ route('admin.users.store') }}" method="POST" class="grid grid-cols-6 gap-3">
                @csrf
                <input name="name" placeholder="Full Name" class="border border-gray-300 p-2 rounded" required>
                <input name="username" placeholder="Username" class="border border-gray-300 p-2 rounded" required>
                <input name="email" type="email" placeholder="Email" class="border border-gray-300 p-2 rounded" required>
                <input name="password" type="password" placeholder="Password" class="border border-gray-300 p-2 rounded" required>
                <select name="role" class="border border-gray-300 p-2 rounded bg-white">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button class="bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Create</button>
            </form>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                        <th class="p-4">Name</th>
                        <th class="p-4">Username</th>
                        <th class="p-4">Email</th>
                        <th class="p-4">Role</th>
                        <th class="p-4">New Password (Optional)</th>
                        <th class="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @foreach($users as $user)
                    <tr class="hover:bg-gray-50 transition-colors">
                        <form action="{{ route('admin.users.update', $user) }}" method="POST" id="update-form-{{$user->id}}">
                            @csrf @method('PUT')
                            <td class="p-2">
                                <input name="name" value="{{ $user->name }}" class="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none px-1">
                            </td>
                            <td class="p-2">
                                <input name="username" value="{{ $user->username }}" class="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none px-1">
                            </td>
                            <td class="p-2">
                                <input name="email" value="{{ $user->email }}" class="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none px-1">
                            </td>
                            <td class="p-2">
                                <select name="role" class="bg-transparent text-xs uppercase font-bold {{ $user->role === 'admin' ? 'text-red-600' : 'text-green-600' }}">
                                    <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>User</option>
                                    <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
                                </select>
                            </td>
                            <td class="p-2">
                                <input name="password" type="password" placeholder="Change..." class="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none px-1 text-xs">
                            </td>
                        </form>
                        
                        <td class="p-4 flex justify-end gap-3">
                            <button onclick="document.getElementById('update-form-{{$user->id}}').submit()" class="text-blue-600 font-bold text-xs uppercase hover:underline">Save</button>
                            
                            @if(auth()->id() !== $user->id)
                                <form action="{{ route('admin.users.destroy', $user) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                                    @csrf @method('DELETE')
                                    <button class="text-red-500 font-bold text-xs uppercase hover:underline">Delete</button>
                                </form>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>