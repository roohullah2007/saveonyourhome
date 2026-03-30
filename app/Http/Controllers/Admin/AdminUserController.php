<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $users = $query->withCount('properties')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,seller,buyer,agent',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip_code' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = $validated['is_active'] ?? true;

        $user = User::create($validated);

        ActivityLog::log('user_created', $user, null, $validated, "Created user: {$user->name}");

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $user->load(['properties', 'inquiries.property']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'properties' => $user->properties()->latest()->take(10)->get(),
            'inquiries' => $user->inquiries()->with('property')->latest()->take(10)->get(),
            'activityLogs' => ActivityLog::where('user_id', $user->id)
                ->latest()
                ->take(20)
                ->get(),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,seller,buyer,agent',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip_code' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $oldValues = $user->toArray();

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        ActivityLog::log('user_updated', $user, $oldValues, $validated, "Updated user: {$user->name}");

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $userName = $user->name;

        // Transfer user's properties to admin before deletion
        $this->transferUserPropertiesToAdmin($user);

        ActivityLog::log('user_deleted', $user, $user->toArray(), null, "Deleted user: {$userName}");

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully. Their properties have been transferred to admin.');
    }

    /**
     * Transfer all user properties to current admin account.
     */
    protected function transferUserPropertiesToAdmin(User $user): void
    {
        $adminUser = auth()->user();

        // Get all user's properties (including soft-deleted)
        $properties = Property::withTrashed()->where('user_id', $user->id)->get();

        foreach ($properties as $property) {
            // Restore if soft-deleted
            if ($property->trashed()) {
                $property->restore();
            }

            // Transfer to admin
            $property->transferToAdmin($adminUser->id);

            // If it was sold, mark sold_at if not already set
            if ($property->listing_status === Property::STATUS_SOLD && !$property->sold_at) {
                $property->update(['sold_at' => now()]);
            }
        }
    }

    public function toggleStatus(User $user)
    {
        // Prevent self-deactivation
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';

        ActivityLog::log("user_{$status}", $user, null, null, "User {$user->name} {$status}");

        return back()->with('success', "User {$status} successfully.");
    }
}
