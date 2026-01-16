<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 flex flex-col items-center justify-center h-screen font-sans antialiased">
    <img src="/images/logo-horiz-black.png" class="h-8 w-auto mb-8 object-contain" alt="Logo">
    <div class="w-full max-w-sm bg-white border border-gray-200 p-10 rounded-lg shadow-sm">
        <div class="text-center mb-8">
            <h1 class="text-xl font-medium tracking-tight text-gray-900">Inventory Admin Console</h1>
            <!-- <h2 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Console</h2> -->
        </div>
        @if($errors->any())<div class="bg-red-50 border border-red-100 text-red-600 p-3 rounded text-xs text-center font-medium mb-6">{{$errors->first()}}</div>@endif
        <form action="/admin/login" method="POST" class="flex flex-col gap-5">
            @csrf
            <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2">Login</label>
                <input type="text" name="login" placeholder="User or Email" class="w-full border border-gray-300 bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors" required>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2">Password</label>
                <input type="password" name="password" placeholder="************" class="w-full border border-gray-300 bg-white px-3 py-2.5 rounded text-sm focus:outline-none focus:border-gray-600 transition-colors" required>
            </div>
            <button class="w-full bg-gray-800 hover:bg-black text-white py-2.5 rounded text-xs font-bold tracking-widest transition-all mt-2">Sign In</button>
        </form>
        <div class="mt-6 pt-6 border-t border-gray-300 text-center">
            <a href="http://localhost:5173" class="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">Back to App</a>
        </div>
    </div>
</body>
</html>