<?php

namespace App\Policies;

use App\Models\User;
use App\Models\category;
use Illuminate\Auth\Access\Response;

class CategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, category $category): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */

    public function create(User $user): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Not allowed to create category');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, category $category): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Not allowed to update category');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, category $category): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Not allowed to delete category');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, category $category): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, category $category): bool
    {
        return false;
    }
}
