<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Console</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6 font-sans text-sm">
    <div class="max-w-6xl mx-auto bg-white p-6 shadow-sm border border-gray-200">
        
        <div class="flex justify-between items-center mb-6">
            <h1 class="font-bold text-lg uppercase tracking-wider">Administration Panel</h1>
            <div class="flex gap-4 items-center">
                <a href="http://localhost:5173" class="text-gray-400 hover:text-black font-bold text-xs uppercase">Go To App</a>
                <form action="{{ route('admin.logout') }}" method="POST">
                    @csrf <button class="text-red-500 font-bold text-xs uppercase hover:underline">Logout</button>
                </form>
            </div>
        </div>

        @if(session('msg')) <div class="bg-green-100 text-green-800 p-2 mb-4 rounded text-xs font-bold">{{ session('msg') }}</div> @endif
        @if($errors->any()) <div class="bg-red-100 text-red-800 p-2 mb-4 rounded text-xs font-bold">{{ $errors->first() }}</div> @endif

        <form action="{{ route('admin.users.store') }}" method="POST" class="flex gap-2 mb-8 bg-gray-50 p-3 rounded border border-gray-200">
            @csrf
            <input name="name" placeholder="Name" class="border p-1 rounded w-full" required>
            <input name="username" placeholder="User" class="border p-1 rounded w-32" required>
            <input name="email" placeholder="Email" class="border p-1 rounded w-48" required>
            <select name="role" class="border p-1 rounded bg-white"><option value="user">User</option><option value="admin">Admin</option></select>
            <input name="password" placeholder="Pass" class="border p-1 rounded w-32" required>
            <button class="bg-black text-white px-4 rounded font-bold uppercase text-xs">Add</button>
        </form>

        <table class="w-full text-left">
            <tr class="text-gray-400 text-xs uppercase border-b"><th class="py-2">Name</th><th>Username</th><th>Email</th><th>Role</th><th>New Pass</th><th class="text-right">Action</th></tr>
            @foreach($users as $u)
                <tr class="border-b hover:bg-gray-50">
                    <form id="form-{{$u->id}}" action="{{ route('admin.users.update', $u) }}" method="POST">
                        @csrf @method('PUT')
                    </form>

                    <td class="py-2 pr-2"><input form="form-{{$u->id}}" name="name" value="{{ $u->name }}" class="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none"></td>
                    <td class="pr-2"><input form="form-{{$u->id}}" name="username" value="{{ $u->username }}" class="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none"></td>
                    <td class="pr-2"><input form="form-{{$u->id}}" name="email" value="{{ $u->email }}" class="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none"></td>
                    <td class="pr-2">
                        <select form="form-{{$u->id}}" name="role" class="bg-transparent font-bold uppercase text-xs {{ $u->role=='admin'?'text-purple-600':'text-gray-600' }}">
                            <option value="user" {{$u->role=='user'?'selected':''}}>User</option>
                            <option value="admin" {{$u->role=='admin'?'selected':''}}>Admin</option>
                        </select>
                    </td>
                    <td class="pr-2"><input form="form-{{$u->id}}" name="password" placeholder="Change..." class="w-24 bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-xs"></td>
                    <td class="text-right flex justify-end gap-3 py-3">
                        <button form="form-{{$u->id}}" class="text-blue-600 font-bold text-xs uppercase hover:underline">Save</button>
                        
                        @if(auth()->id() !== $u->id)
                            <form action="{{ route('admin.users.destroy', $u) }}" method="POST" onsubmit="return confirm('Delete?')">
                                @csrf @method('DELETE')
                                <button class="text-red-500 font-bold text-xs uppercase hover:underline">Del</button>
                            </form>
                        @endif
                    </td>
                </tr>
            @endforeach
        </table>
    </div>
</body>
</html>