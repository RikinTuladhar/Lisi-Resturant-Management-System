<?php

namespace App\Policies;

use App\Models\User;
use App\Models\item;
use Illuminate\Auth\Access\Response;

class ItemPolicy
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
    public function view(User $user, item $item): bool
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
            : Response::deny('Not allowed to create item');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, item $item): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Not allowed to update item');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, item $item): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Not allowed to delete item');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, item $item): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, item $item): bool
    {
        return false;
    }
}
