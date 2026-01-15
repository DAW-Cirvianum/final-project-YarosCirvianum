<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded shadow-md w-96">
        <h1 class="text-2xl font-bold mb-6 text-center">Admin Access</h1>
        
        @if ($errors->any())
            <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="/admin/login" method="POST">
            @csrf
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Email</label>
                <input type="email" name="email" class="w-full border p-2 rounded" required>
            </div>
            <div class="mb-6">
                <label class="block text-sm font-bold mb-2">Password</label>
                <input type="password" name="password" class="w-full border p-2 rounded" required>
            </div>
            <button class="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800">Login</button>
        </form>
    </div>
</body>
</html>